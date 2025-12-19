---
title: CustomSearch
description:
toc: content
group:
  title: 表单
order: 25
demo:
  cols: 2
---

## CustomSearch 筛选组件

`CustomSearch` 是一个用于展示筛选的表单组件，适用于立即触发的场景。结合 `ProTable` 使用
通过 `params` 传递给 `ProTable` 和 给以 `ProTable` 一个动态的高度

## 何时使用

- 显示筛选列表，让用户可以筛选出需要的数据。
- 提供一致的筛选列表样式，以保持整体设计风格。
- 允许灵活配置筛选列表内容。

## 示例

<code src='./demo/index.tsx'>立即触发的筛选</code>

```tsx | pure
<ProTable<ColumnsType, SearchType>
  style={{ '--table-min-h': TableHeight + 'px' } as any}
  className="[&_.ant-table-body]:min-h-[var(--table-min-h)]"
  search={false}
  actionRef={actionRef}
  toolbar={{
    settings: [],
    search: false,
  }}
  rowHoverable={false}
  params={{
    ...formValues,
  }}
  size="small"
  pagination={{ defaultPageSize: 10, showSizeChanger: true }}
  scroll={{ y: TableHeight }}
  locale={{
    emptyText: (
      <CustomTooltip.TableEmpty
        description={isNoPermission ? '暂无权限' : '暂无数据'}
        height={Number(TableHeight)}
      />
    ),
  }}
/>
```

## API
