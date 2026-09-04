import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import type { CustomFormList } from '../CustomForm/interface';
import { CUSTOM_SEARCH_FORM_ITEM_KEY } from './constants';
import { resolveSorterTagLabel } from './filterTagUtils';
import type { CustomSearchFilterTag } from './interface';

export type SortOrder = 'ascend' | 'descend';
export type TableSorterTag = CustomSearchFilterTag & { sortOrder: SortOrder; fieldName: string };

/**
 * 获取列用于排序状态匹配的稳定字段名。
 * @param column 当前列配置。
 * @returns 排序字段名。
 */
function getColumnFieldName(column: Record<string, any>): string {
  return String(column.key ?? column.dataIndex ?? '');
}

/**
 * 在含分组列的配置中查找排序列。
 * @param columns 当前层列配置。
 * @param fieldName Ant Table 返回的字段名。
 * @returns 匹配列配置。
 */
function findSorterColumn(columns: Array<Record<string, any>>, fieldName: string): Record<string, any> | undefined {
  for (const column of columns) {
    if (getColumnFieldName(column) === fieldName) return column;
    const childColumn = Array.isArray(column.children) ? findSorterColumn(column.children, fieldName) : undefined;
    if (childColumn) return childColumn;
  }
  return undefined;
}

/**
 * 将 Ant Table sorter 转换为搜索栏排序 Tag。
 * @param sorter Table onChange 返回的排序信息。
 * @param columns 当前表格列配置。
 * @returns 当前有效排序 Tag。
 */
function normalizeSorterTags(sorter: SorterResult<any> | SorterResult<any>[], columns: any[]): TableSorterTag[] {
  const sorters = Array.isArray(sorter) ? sorter : [sorter];
  return sorters.flatMap((entry) => {
    if (!entry?.order) return [];
    const sorterFieldName = String(entry.columnKey ?? entry.field ?? '');
    if (!sorterFieldName) return [];
    const column = findSorterColumn(columns, sorterFieldName);
    const fieldName = column ? getColumnFieldName(column) : sorterFieldName;
    return [
      {
        key: `sort:${fieldName}`,
        label: resolveSorterTagLabel(column?.title, fieldName),
        valueText: entry.order === 'ascend' ? '升序' : '降序',
        fieldName,
        sortOrder: entry.order,
      },
    ];
  });
}

/**
 * 收集表格列声明的默认排序条件。
 * @param node CustomSearch 内的 React 节点。
 * @returns 默认排序 Tag。
 */
export function collectDefaultSorterTags(node: React.ReactNode): TableSorterTag[] {
  const tags: TableSorterTag[] = [];
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement<any>(child)) return;
    const childProps = child.props as Record<string, any>;
    if (Array.isArray(childProps.columns)) {
      childProps.columns.forEach((column: any) => {
        if (!column?.defaultSortOrder) return;
        const fieldName = String(column.key ?? column.dataIndex ?? '');
        if (!fieldName) return;
        tags.push({
          key: `sort:${fieldName}`,
          label: resolveSorterTagLabel(column.title, fieldName),
          valueText: column.defaultSortOrder === 'ascend' ? '升序' : '降序',
          fieldName,
          sortOrder: column.defaultSortOrder,
        });
      });
      return;
    }
    if (childProps.children) tags.push(...collectDefaultSorterTags(childProps.children));
  });
  return tags;
}

/**
 * 收集列筛选挂载的表单配置。
 * @param node CustomSearch 内的 React 节点。
 * @returns 列筛选表单配置。
 */
export function collectTableFilterFormItems(node: React.ReactNode): CustomFormList<any, any> {
  const items: CustomFormList<any, any> = [];
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement<any>(child)) return;
    const childProps = child.props as Record<string, any>;
    if (Array.isArray(childProps.columns)) {
      const collectColumns = (columns: Array<Record<string, any>>) => {
        columns.forEach((column) => {
          const formItem = column[CUSTOM_SEARCH_FORM_ITEM_KEY];
          if (formItem) items.push({ ...formItem, label: formItem.label || column.title });
          if (Array.isArray(column.children)) collectColumns(column.children);
        });
      };
      collectColumns(childProps.columns);
      return;
    }
    if (childProps.children) items.push(...collectTableFilterFormItems(childProps.children));
  });
  return items;
}

/**
 * 将排序 Tag 转为 ProTable request 使用的排序对象。
 * @param tags 当前排序 Tag。
 * @returns ProTable 排序参数。
 */
function buildRequestSorter(tags: TableSorterTag[]): Record<string, SortOrder> {
  return Object.fromEntries(tags.map((tag) => [tag.fieldName, tag.sortOrder]));
}

/**
 * 生成排序图标颜色同步的 CSS 文本。
 * @param className 列自定义类名。
 * @param sortOrder 当前排序方向。
 * @returns CSS 规则文本。
 */
function buildSorterIconCss(className: string, sortOrder: SortOrder | undefined): string {
  const upColor = sortOrder === 'ascend' ? 'var(--ims-color-primary, #1677ff)' : 'var(--ims-color-text-quaternary, rgba(0,0,0,0.25))';
  const downColor = sortOrder === 'descend' ? 'var(--ims-color-primary, #1677ff)' : 'var(--ims-color-text-quaternary, rgba(0,0,0,0.25))';
  return `
.${className} .ant-table-column-sorter-up { color: ${upColor} !important; }
.${className} .ant-table-column-sorter-down { color: ${downColor} !important; }
`;
}

/**
 * 将 Tag 排序状态写回表格列，确保列头排序图标同步更新。
 * @param columns 当前层列配置。
 * @param sorterTags 当前排序 Tag。
 * @returns 受控排序列配置。
 */
function enhanceSortableColumns(
  columns: Array<Record<string, any>>,
  sorterTags: TableSorterTag[],
): Array<Record<string, any>> {
  return columns.map((column) => {
    const children: unknown = Array.isArray(column.children)
      ? enhanceSortableColumns(column.children, sorterTags)
      : column.children;
    if (!column?.sorter) return children === column.children ? column : { ...column, children };
    const fieldName = getColumnFieldName(column);
    const activeSorter = sorterTags.find((tag) => tag.fieldName === fieldName);
    const sorterCssClass = `ims-sorter-${fieldName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const { defaultSortOrder: _ignoredDefaultSortOrder, ...columnWithoutDefaultSort } = column;
    return {
      ...columnWithoutDefaultSort,
      children,
      className: [column.className, sorterCssClass].filter(Boolean).join(' '),
      sortOrder: activeSorter?.sortOrder ?? null,
      onHeaderCell: () => ({
        className: sorterCssClass,
        style: {} as React.CSSProperties,
      }),
      __sorterIconStyle: activeSorter?.sortOrder,
      __sorterCssClass: sorterCssClass,
    };
  });
}

/**
 * 递归增强 CustomSearch 内的 ProTable，使排序条件可由 Tag 控制。
 * @param node CustomSearch 内的 React 节点。
 * @param sorterTags 当前排序 Tag。
 * @param setSorterTags 排序 Tag 更新函数。
 * @param requestKey 查询或重置时递增的强制刷新标识。
 * @returns 注入排序联动后的 React 节点。
 */
export function enhanceTableSorterTags(
  node: React.ReactNode,
  sorterTags: TableSorterTag[],
  setSorterTags: Dispatch<SetStateAction<TableSorterTag[] | undefined>>,
  requestKey: number,
): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement<any>(child)) return child;
    const childProps = child.props as Record<string, any>;
    if (Array.isArray(childProps.columns) && typeof childProps.request === 'function') {
      const columns = enhanceSortableColumns(childProps.columns, sorterTags);
      const sorterCssText = columns
        .filter((col) => col.__sorterCssClass)
        .map((col) => buildSorterIconCss(col.__sorterCssClass, col.__sorterIconStyle))
        .join('\n');
      const cleanColumns = columns.map(({ __sorterIconStyle, __sorterCssClass, ...rest }) => rest);
      return (
        <>
          {sorterCssText ? <style dangerouslySetInnerHTML={{ __html: sorterCssText }} /> : null}
          {React.cloneElement(child, {
            columns: cleanColumns,
            params: {
              ...childProps.params,
              __customSearchSorter: buildRequestSorter(sorterTags),
              __customSearchRequestKey: requestKey,
            },
            request: (params: Record<string, unknown>, _sort: Record<string, SortOrder>, filter: unknown) => {
              const {
                __customSearchSorter: _ignoredSorter,
                __customSearchRequestKey: _ignoredRequestKey,
                ...requestParams
              } = params;
              return childProps.request(requestParams, buildRequestSorter(sorterTags), filter);
            },
            onChange: (
              pagination: unknown,
              filters: unknown,
              sorter: SorterResult<any> | SorterResult<any>[],
              extra: TableCurrentDataSource<any>,
            ) => {
              setSorterTags(normalizeSorterTags(sorter, cleanColumns));
              childProps.onChange?.(pagination, filters, sorter, extra);
            },
          })}
        </>
      );
    }
    if (childProps.children) {
      return React.cloneElement(child, {
        children: enhanceTableSorterTags(childProps.children, sorterTags, setSorterTags, requestKey),
      });
    }
    return child;
  });
}
