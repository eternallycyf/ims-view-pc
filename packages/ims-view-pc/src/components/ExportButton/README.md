---
title: ExportButton
description: 导出execl
toc: content
group:
  title: 文件
demo:
  cols: 2
---

## ExportButton 导出

需要前端导出 excel 复杂 excel 大数据 excel

## 何时使用

- 导出多级表头
- 合并单元格
- 导出树形表格
- 导出图片
- 设置 Excel 行 列 单元格 自定义 excel 样式 Excel-sheet 样式
- 插入头部 尾部
- 导出多个 sheet 页面
- 自定义配置 WorkSheet
- 10 万条+数据

## 示例

<code src="./demo/base.tsx">普通导出</code>

<code src="./demo/header.tsx">表头合并</code>

<code src="./demo/merge.tsx">合并单元格</code>

<code src="./demo/image.tsx">图片</code>

<code src="./demo/style.tsx">css</code>

<code src="./demo/insert.tsx">插入头部尾部</code>

<code src="./demo/tree.tsx">树形缩进</code>

<code src="./demo/more.tsx">多个 sheet 页</code>

<code src="./demo/worksheet.tsx">WorkSheet</code>

<code src="./demo/large.tsx">10 万条数据</code>

## API

### column

| 参数      | 说明                                                 | 类型   | 默认值 |
| --------- | ---------------------------------------------------- | ------ | ------ |
| title     | 对应的 Excel 列名,可通过 **columnKey 设置**          | any    | -      |
| dataIndex | Excel 列对应的数据源字段                             | string | -      |
| children  | Excel 表头分组嵌套列配置,可通过 **childrenKey 设置** | array  | -      |

### data

> 显示的数据

### 其他

| 参数            | <div style="width:200">说明</div>                                                              | 类型                                                    | 默认值                 |
| --------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------- |
| progress        | 导出时触发的进度条方法                                                                         | Function(val)                                           | -                      |
| dataIndex       | 可自定义配置为其他字段，支持通过 **数组查询嵌套路径(['a','b','c'])** 或 **a.b.c 查询嵌套路径** | string \| string[]                                      | dataIndex              |
| treeNode        | 标识导出后是否以 **树形结构** 展示                                                             | boolean                                                 | false                  |
| treeField       | 默认会取第一列的字段作为 **树形结构展示**，如果是其他列可以用 **treeField** 字段来指定列名     | string                                                  | 第一列的字段           |
| indentSize      | 控制 **树形结构的层级缩进**                                                                    | number                                                  | 1                      |
| spanMethod      | 合并行或列的计算方法                                                                           | Function({ row, column, rowIndex, columnIndex })/Object | -                      |
| sheetName       | **Excel** 中的 **Sheet** 名称                                                                  | string                                                  | `sheet + i + 1`        |
| columnKey       | **Excel** 默认的列名配置名称                                                                   | string                                                  | title                  |
| childrenKey     | **Excel** 表头分组嵌套列/树形结构子节点 名称                                                   | string                                                  | children               |
| setColumnStyle  | 列的 **style** 方法                                                                            | Function({columnIndex})/Object                          | -                      |
| setRowStyle     | 行的 **style** 方法                                                                            | Function({data,rowIndex,columnIndex,type})/Object       | -                      |
| setCellStyle    | 单元格的 **style** 方法                                                                        | Function({data,rowIndex,columnIndex,type})/Object       | -                      |
| setImageStyle   | 图片的 **style** 方法                                                                          | Function({data,rowIndex,columnIndex,type})/Object       | {width:100,height:100} |
| setCellFormat   | 单元格的 **格式** 方法                                                                         | Function({data,rowIndex,columnIndex,type})/Object       | -                      |
| setSheetStyle   | **Excel** 中 **Sheet** 样式的方法                                                              | Function({sheetIndex})/Object                           | -                      |
| setInsertHeader | 临时插入数据到 **Excel 头部** 的方法                                                           | Function({sheetIndex})/Object                           | -                      |
| setInsertFooter | 临时插入数据到 **Excel 尾部** 的方法                                                           | Function({sheetIndex})/Object                           | -                      |
| setWorkSheet    | 用户自定义设置 **WorkSheet**的方法                                                             | Function({worksheet,sheetIndex})/void                   | -                      |
| tables          | 导出多个 **table**                                                                             | array                                                   | [{table}]              |
