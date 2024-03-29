import { defaultColumnStyle, defaultThRowStyle } from '../excel-style';
import { STableExporter } from '../s-table-exporter';
import {
  createArray,
  flatTree,
  getValueByObj,
  hasOwnProperty,
  isArray,
  isFunction,
  isNumber,
  isObject,
  warn,
} from '../util';
import { mapCreateCombinTable, mapCreateMergeHeaderTable, mapCreateTable } from './helpers';

export class ElMapExportTable {
  constructor(configData = {}, options = {}) {
    this.tables = [];
    this.progress = options.progress;
    this.indentSize = options.indentSize || 1;
    this.calculate(configData);
  }

  calculate(configData) {
    //eslint-disable-next-line
    configData = isObject(configData) ? [configData] : configData;
    const configLen = configData.length;
    // 循环的是多个sheet,常数级
    for (let i = 0; i < configLen; i++) {
      const config = configData[i];
      const sheetName = config.sheetName;
      const sheetCallback = config.setWorkSheet;
      const insertHeaderData = this.handleInsertExcelHeader(config.setInsertHeader, i);
      const headerData = this.handleExcelHeader(config);
      const mainData = this.handleExcelMain(config, headerData.columnKeys);
      const footerData = this.handleInsertExcelFooter(config.setInsertFooter, i);
      const options = this.handleExcelSheet(config.setSheetStyle, i);
      const table = {
        insertHeaderData,
        headerData,
        mainData,
        footerData,
        sheetName,
        sheetCallback,
        options,
      };
      console.log(table, 'table');
      this.tables.push(table);
    }
  }

  handleInsertExcelHeader(userSetInsertHeader, sheetIndex) {
    return this.setInsertHeader(userSetInsertHeader, { sheetIndex });
  }

  handleInsertExcelFooter(userSetInsertFooter, sheetIndex) {
    return this.setInsertFooter(userSetInsertFooter, { sheetIndex });
  }

  handleExcelHeader(config) {
    const {
      column = [],
      dataIndex = 'dataIndex',
      columnKey: field = 'title',
      childrenKey = 'children',
      ...rest
    } = config;
    const columnKeys = [];
    const result = mapCreateMergeHeaderTable({
      data: column,
      mapCreateColumn: ({ columnLen }) => {
        return createArray(columnLen, (index) => {
          return {
            field: `${index}-field`,
            excel: this.setColumnStyle(rest.setColumnStyle, index),
          };
        });
      },
      mapCreateData: ({ data, columnIndex, rowIndex }) => {
        const key = `${columnIndex}-field`;
        const value = data[field];
        const rowStyle = this.setRowStyle(
          rest.setRowStyle,
          { data, columnIndex, rowIndex, type: 'header' },
          true,
        );
        const cellStyle = this.setCellStyle(rest.setCellStyle, {
          data,
          columnIndex,
          rowIndex,
          type: 'header',
        });
        const imageStyle = this.setImageStyle(rest.setImageStyle, {
          data,
          columnIndex,
          rowIndex,
          type: 'header',
        });
        const cellFormat = this.setCellFormat(rest.setCellFormat, {
          data,
          columnIndex,
          rowIndex,
          type: 'header',
        });
        if (
          hasOwnProperty(data, dataIndex) &&
          hasOwnProperty(data, '$leafNode') &&
          data['$leafNode'] === true
        ) {
          // 表头分组中过滤掉开发者传的非末级节点dataIndex
          const columnKey = data[dataIndex];
          columnKeys.push(columnKey);
        }
        return {
          key,
          value,
          excel: {
            text: value, // 预留覆盖文本
            ...rowStyle,
            ...cellStyle,
            ...cellFormat,
            ...imageStyle,
          },
        };
      },
      field: childrenKey,
    });
    const {
      mergeCells,
      data: tableData,
      excel: { rowStyle, columnStyle },
    } = result;
    return {
      cells: mergeCells,
      rowLength: tableData.length,
      rowStyle,
      columnStyle,
      columnKeys,
    };
  }

  handleExcelMain(config, columnKeys) {
    let {
      data: userData = [],
      childrenKey = 'children',
      treeNode = false, // 是否为树形结构
      treeField = columnKeys[0], // 哪一列为树形结构，默认第一列
      spanMethod,
      ...rest
    } = config;
    let result = null;
    const indentSize = this.indentSize;
    const isCombin = isFunction(spanMethod);
    if (isCombin) {
      // 组合
      const {
        mergeCells,
        data,
        excel: { rowStyle },
      } = mapCreateCombinTable({
        data: {
          rowList: userData,
          columnList: columnKeys,
        },
        mapCreateColumn: ({ columnLen }) => {
          return createArray(columnLen, (index) => {
            return {
              field: `${index}-field`,
            };
          });
        },
        mapCreateData: ({ row, column, rowIndex, columnIndex }) => {
          const key = `${columnIndex}-field`;
          const value = getValueByObj(row, column);
          const rowStyle = this.setRowStyle(
            rest.setRowStyle,
            { data: row, columnIndex, rowIndex, type: 'main' },
            false,
          );
          const cellStyle = this.setCellStyle(rest.setCellStyle, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          const imageStyle = this.setImageStyle(rest.setImageStyle, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          const cellFormat = this.setCellFormat(rest.setCellFormat, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          return {
            key,
            value,
            excel: {
              text: value,
              ...rowStyle,
              ...cellStyle,
              ...cellFormat,
              ...imageStyle,
            },
          };
        },
        spanMethod: ({ row, column, rowIndex, columnIndex }) => {
          let result = { rowspan: 1, colspan: 1 };
          const { rowspan, colspan } = spanMethod({ row, column, rowIndex, columnIndex }) || {};
          if (isNumber(rowspan) && rowspan > 1) {
            // 如果行超出范围就进行修正
            result.rowspan =
              rowIndex + rowspan - 1 > userData.length - 1 ? userData.length - rowIndex : rowspan;
          }
          if (isNumber(colspan) && colspan > 1) {
            // 如果列超出范围就进行修正
            result.colspan =
              columnIndex + colspan - 1 > columnKeys.length - 1
                ? columnKeys.length - columnIndex
                : colspan;
          }
          return result;
        },
        field: childrenKey,
      });
      result = {
        cells: mergeCells,
        rowStyle,
        rowLength: data.length,
      };
    } else {
      // 不合并
      const {
        mergeCells,
        data,
        excel: { rowStyle },
      } = mapCreateTable({
        data: {
          rowList: treeNode ? flatTree(userData, childrenKey) : userData,
          columnList: columnKeys,
        },
        mapCreateColumn: ({ columnLen }) => {
          return createArray(columnLen, (index) => {
            return {
              field: `${index}-field`,
            };
          });
        },
        mapCreateData: ({ row, column, rowIndex, columnIndex }) => {
          const key = `${columnIndex}-field`;
          const value = getValueByObj(row, column);
          const rowStyle = this.setRowStyle(
            rest.setRowStyle,
            { data: row, columnIndex, rowIndex, type: 'main' },
            false,
          );
          const cellStyle = this.setCellStyle(rest.setCellStyle, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          const imageStyle = this.setImageStyle(rest.setImageStyle, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          const cellFormat = this.setCellFormat(rest.setCellFormat, {
            data: row,
            columnIndex,
            rowIndex,
            type: 'main',
          });
          if (treeNode && treeField === column) {
            // 设置树形结构的缩进样式
            this.setTreeIndentStyle(row, cellStyle, indentSize);
          }
          return {
            key,
            value,
            excel: {
              text: value,
              ...rowStyle,
              ...cellStyle,
              ...cellFormat,
              ...imageStyle,
            },
          };
        },
        field: childrenKey,
      });
      result = {
        cells: mergeCells,
        rowStyle,
        rowLength: data.length,
      };
    }
    return result;
  }

  handleExcelSheet(userSetSheetStyle, sheetIndex) {
    return this.setSheetStyle(userSetSheetStyle, { sheetIndex });
  }

  // 设置列样式
  setColumnStyle(userSetColumnStyleFn, columnIndex) {
    let style = defaultColumnStyle;
    if (isFunction(userSetColumnStyleFn)) {
      const userStyle = userSetColumnStyleFn({ columnIndex });
      if (isObject(userStyle)) {
        style = userStyle;
      }
    }
    return style;
  }

  // 设置行样式
  setRowStyle(userSetRowStyle, { data, columnIndex, rowIndex, type }, isHeaderRow = false) {
    let style = isHeaderRow ? defaultThRowStyle : {};
    if (isFunction(userSetRowStyle)) {
      const userStyle = userSetRowStyle({ data, columnIndex, rowIndex, type });
      if (isObject(userStyle)) {
        style = userStyle;
      }
    }
    return style;
  }

  // 设置单元格样式
  setCellStyle(userSetCellStyle, { data, columnIndex, rowIndex, type }) {
    let result = {
      style: {},
    };
    if (isFunction(userSetCellStyle)) {
      const userStyle = userSetCellStyle({ data, columnIndex, rowIndex, type });
      if (isObject(userStyle)) {
        result.style = userStyle;
      }
    }
    return result;
  }

  // 设置单元格格式(默认只会进行文本值的计算)
  setCellFormat(userSetCellFormat, { data, columnIndex, rowIndex, type }) {
    let result = {
      format: {},
    };
    if (isFunction(userSetCellFormat)) {
      const userFormat = userSetCellFormat({ data, columnIndex, rowIndex, type });
      if (isObject(userFormat)) {
        result.format = userFormat;
      }
    }
    return result;
  }

  // 设置树形结构的单元格样式(内部控制,向外暴露indentSize)
  setTreeIndentStyle(row, cellStyle, indentSize) {
    const userStyle = cellStyle.style.alignment || {};
    const level = row.$level; // flatTree中添加的$level
    const indent = (level - 1) * indentSize;
    const alignment = {
      indent,
      vertical: 'middle',
      wrapText: true,
    };
    cellStyle.style.alignment = {
      ...userStyle,
      ...alignment,
    };
  }

  // 设置图片样式
  setImageStyle(userSetImageStyle, { data, columnIndex, rowIndex, type }) {
    let result = {
      image: {},
    };
    if (isFunction(userSetImageStyle)) {
      const userImageStyle = userSetImageStyle({ data, columnIndex, rowIndex, type });
      if (isObject(userImageStyle)) {
        result.image = userImageStyle;
      }
    }
    return result;
  }

  // 设置sheet样式
  setSheetStyle(userSetSheetStyle, { sheetIndex }) {
    let result = {};
    if (isFunction(userSetSheetStyle)) {
      const userStyle = userSetSheetStyle({ sheetIndex });
      if (isObject(userStyle)) {
        result = userStyle;
      }
    }
    return result;
  }

  // 设置插入到头部的内容
  setInsertHeader(userSetInsertHeader, { sheetIndex }) {
    let result = {};
    if (isFunction(userSetInsertHeader)) {
      const userResult = userSetInsertHeader({ sheetIndex });
      if (isObject(userResult)) {
        const { columnStyle = [], rowStyle = [], cells = [] } = userResult;
        if (isArray(columnStyle) && isArray(rowStyle) && isArray(cells)) {
          const { row, rowspan = 1 } = cells[cells.length - 1];
          if (!isNumber(row) && !isNumber(rowspan)) return warn('请输入正确的参数');
          result.columnStyle = columnStyle;
          result.rowStyle = rowStyle;
          result.cells = cells;
          result.rowLength = row + rowspan;
          this.calculateIsNeedMerge(cells);
        }
      }
    }
    return result;
  }

  // 设置插入到尾部的内容
  setInsertFooter(userSetInsertFooter, { sheetIndex }) {
    let result = {};
    if (isFunction(userSetInsertFooter)) {
      const userResult = userSetInsertFooter({ sheetIndex });
      if (isObject(userResult)) {
        const { columnStyle = [], rowStyle = [], cells = [] } = userResult;
        if (isArray(columnStyle) && isArray(rowStyle) && isArray(cells)) {
          const { row, rowspan = 1 } = cells[cells.length - 1];
          if (!isNumber(row) && !isNumber(rowspan)) return warn('请输入正确的参数');
          result.columnStyle = columnStyle;
          result.rowStyle = rowStyle;
          result.cells = cells;
          result.rowLength = row + rowspan;
          this.calculateIsNeedMerge(cells);
        }
      }
    }
    return result;
  }

  // 计算是否需要合并
  calculateIsNeedMerge(cells) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const { rowspan = 1, colspan = 1 } = cell;
      cell.isNeedMerge = rowspan !== 1 || colspan !== 1;
    }
  }

  async download(fileName) {
    const tables = this.tables;
    const progress = this.progress;
    const exportInstance = new STableExporter({
      progress,
      tables: tables,
    });
    await exportInstance.init();
    await exportInstance.export();
    exportInstance.download(fileName);
  }
}
