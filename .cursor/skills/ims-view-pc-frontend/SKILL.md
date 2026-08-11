---
name: ims-view-pc-frontend
description: >-
  Guides CRUD page development in apps that depend on ims-view-pc: page
  directory layout, enums/types/utils/columns, CustomForm/CommonTable/ExportButton
  conventions, and project-local lint via package.json. Use when building or
  refactoring list/CRUD pages or components in projects that import ims-view-pc.
---

# ims-view-pc Frontend Development

## 作用域

适用于**依赖 `ims-view-pc`（及可选 `@ims-view/hooks` / `@ims-view/utils` / `@ims-view/chart`）的业务前端项目**。

- UI 优先从 `ims-view-pc` 引入，禁止重复造同名轮子
- 页面目录、CRUD、枚举/类型/列配置：用下文公共约定
- Lint / Format：**跟随当前业务项目根目录 `package.json` 的 scripts**，不要写死 oxlint / eslint / prettier 某一种

```ts
import {
  AccessBtn,
  CommonSearch,
  CommonTable,
  CustomForm,
  CustomSearch,
  CustomTag,
  CustomTooltip,
  ExportButton,
  Icon,
  TableExtraBtn,
  useBaseComponent,
} from 'ims-view-pc'
```

---

## 页面目录规范

```text
xxx/
├── index.tsx
├── index.less          # 或项目已有样式约定（less / scss）；禁止随意混用 module.scss
├── service.ts          # 请求统一放这里，对外暴露 fetchXXX / createXXX / updateXXX / deleteXXX
├── hook/
│   ├── useXXX.ts
│   └── useXXXColumns.ts
├── component/
│   ├── CreateModal/
│   ├── EditModal/
│   ├── DeleteModal/
│   └── DetailModal/
└── config/
    ├── constant.ts
    ├── columns.tsx     # 复数 columns，不要写成 column.tsx
    ├── interface.ts
    └── utils.ts
```

### 文件职责

| 文件 | 负责 | 禁止 |
|------|------|------|
| `index.tsx` | 页面主体、查询、请求状态、操作列/行按钮组装、Modal / Ref | 大量 columns、工具函数、枚举、复杂类型 |
| `index.less` 等 | 页面样式 | 无项目约定时不要新建 `style.ts` / `module.scss` |
| `hook/` | 请求封装、数据转换、业务/交互抽象 | — |
| `component/` | Create/Edit/Delete/Detail 等业务弹窗组件 | 在 `index.tsx` 内联大 Modal |
| `config/` | 枚举、类型、工具、普通列 | — |
| `service.ts` | 所有页面请求出口 | 在页面里散落写请求 |

---

## 枚举 / 类型 / 工具 / 列

### 枚举 → `config/constant.ts`

统一维护：枚举 + Map + Options。

```ts
export enum DataSchemaType {
  SCHEMA = 'schema',
  TAG = 'tag',
  DELETE = 'delete',
}

export const DataSchemaTypeMap = {
  [DataSchemaType.SCHEMA]: '数据模型',
  [DataSchemaType.TAG]: '标签集',
  [DataSchemaType.DELETE]: '删除',
} as const

export const DataSchemaTypeOptions = [
  { label: DataSchemaTypeMap[DataSchemaType.SCHEMA], value: DataSchemaType.SCHEMA },
  { label: DataSchemaTypeMap[DataSchemaType.TAG], value: DataSchemaType.TAG },
  { label: DataSchemaTypeMap[DataSchemaType.DELETE], value: DataSchemaType.DELETE },
] as const
```

### 类型 → `config/interface.ts`

```ts
export interface UserInfo {}
export interface UserSearchValue {}
export type UserColumnType = {}
```

### 工具 → `config/utils.ts`

```ts
export const formatUserName = () => {}
export const transformTableData = () => {}
```

### 普通列 → `config/columns.tsx`

- 列表列、导出列放这里
- 文案类优先省略自定义 `render`；需要溢出时用 `CustomTooltip.Paragraph` / `ellipsis` 等组件能力

### 操作列 / 行按钮 → `index.tsx`

- **CommonTable**：用 `itemButton` / `buttonLeft` / `buttonRight`（内部走 `AccessBtn`）
- 若项目仍用 ProTable：操作列写在 `index.tsx`，再与 `config/columns` 合并

```ts
const columns = [...defaultColumns] // 普通列来自 config
// 行操作在 CommonTable 的 itemButton 中组装，不要塞进 columns.tsx
```

刷新统一封装，不要到处直接 reload：

```ts
const refreshPage = () => {
  // CommonTable：ActionRef / handleRefreshPage（useBaseComponent）
  // ProTable：actionRef.current?.reload()
}
```

---

## CRUD 页面规范

参考（组件库文档站）：`ims-view-pc` 包内 `CommonTable/demo/demo1`（`useBaseComponent` + `CommonSearch` + `CommonTable` + `ExportButton`）。

### 查询

优先其一（按页面已有风格保持一致）：

1. **`CommonSearch` + `useBaseComponent`**（列表 CRUD 首选）
2. **`CustomForm.CustomSearch` / `CustomForm.useCustomSearch`**（需 CustomForm 搜索栏时）

完成：搜索、重置、表单与列表参数同步。

### 请求

- 列表 / 详情 / 增删改：统一走 `service.ts` + 页面级 `loading`
- 可用项目内已有请求封装（如 ahooks `useRequest`、`@ims-view/hooks` 的 `useFetch`）；**与当前仓库习惯对齐**，不强制换库
- 列表页状态优先复用 `useBaseComponent`（loading、searchParams、选中、刷新等）

### 页面骨架

```tsx
<div className="xxx">
  <CommonSearch formList={...} onSearch={handleSearch} loading={loading} ref={FormRef} />
  <CommonTable
    columns={columns}
    loading={loading}
    ref={ActionRef}
    searchParams={searchParams}
    setSearchParams={setSearchParams}
    buttonRight={[/* 导出等 */]}
    itemButton={(text, record) => [/* 行操作 */]}
    request={...}
  />
  <CreateModal ref={...} />
  <EditModal ref={...} />
  <DeleteModal ref={...} />
</div>
```

必须支持：筛选、重置、Loading；有列内搜索需求时按项目/`CustomForm.Utils` 既有方式接入。

---

## 业务组件 Ref

统一 `forwardRef` + `useImperativeHandle` 暴露打开/提交等方法。

禁止用一堆 `props.onOpen` / `props.onDelete` 做跨组件命令式控制（展示型回调除外）。

---

## UI 组件约定（ims-view-pc）

| 场景 | 使用 | 禁止 |
|------|------|------|
| 表单 | `CustomForm` / `CustomModal.FormModal` | 无必要直接裸用 antd `Form` |
| 列表搜索 | `CommonSearch` 或 `CustomForm.CustomSearch` | 手写一套搜索栏 |
| 列表表格 | 优先 `CommonTable` | 无必要时再引入其它表格栈 |
| 文案溢出 | `CustomTooltip.Paragraph` | 长文本裸露无省略 |
| 文件名溢出 | `CustomTooltip.FileNameEllipsis` | — |
| Tag | `CustomTag` | 直接 antd `Tag`（主题封装场景除外） |
| 表格/工具按钮 | `AccessBtn`、`CommonTable` 的 `buttonLeft`/`buttonRight`/`itemButton`、`TableExtraBtn` | 表格操作区随意堆 antd `Button` |
| 图标 | `Icon` | 臆造 `CommonIcon`（本包无此导出） |
| Excel 导出 | `ExportButton` | 页面内手写 exceljs / file-saver 样板 |

### 导出 Excel

1. 导出列 / 行映射放 `config/columns.tsx`（不要带操作列）
2. 导出请求复用**最近一次列表查询条件**（含排序筛选），`current: 1`，较大 `pageSize`；不要用 `pageSize: -1`
3. 挂在 `buttonRight`（或工具栏）`type: 'custom'` 的 `element` 里：

```tsx
{
  type: 'custom',
  element: (
    <ExportButton
      columns={exportColumns}
      fileName="页面名"
      request={handleExportRequest}
    />
  ),
}
```

4. 样式回调用 `ExportButton` 已有 `setCellStyle` / `setRowStyle` / `setSheetStyle` 等，类型跟组件声明走
5. 包内**无** `JsonExportButton`：配置类 JSON 导出可在业务侧用下载工具自行实现，或抽公共小组件，不要用 `ExportButton` 硬出 Excel

---

## 代码编写规范

1. **判空**：优先 `?.` / `??`；空值判断优先 `lodash/isNil`。上游结构固定时不做冗余 `Array.isArray` 防护。
2. **注释**：默认不加；只给复杂业务、转换、非显然分支写短注释。
3. **Lint / Format（强制）**
   - 打开**当前业务项目**根目录 `package.json`，按其中 `lint` / `lint:*` / `format` / `prettier` / `tsc` 等脚本执行
   - 至少对改动文件跑通该项目约定的检查与格式化
   - 工具改写的文件一并纳入交付；禁止带着已知 lint/format 失败交付
   - **不要**假设全员使用 oxlint 或本组件库的 eslint 命令

---

## 开发原则

1. 优先复用 `ims-view-pc` 已有组件与 `@ims-view/*` 能力
2. 页面目录与职责拆分保持统一
3. 枚举 → `constant.ts`；类型 → `interface.ts`；工具 → `utils.ts`；请求 → `service.ts`
4. 普通列 → `columns.tsx`；操作/工具按钮 → `index.tsx`（或 CommonTable 按钮配置）
5. CRUD 支持筛选、重置、Loading
6. 业务弹窗统一 Ref 暴露
7. 文案溢出必须处理；Tag 用 `CustomTag`；表格按钮走 AccessBtn 体系
8. 表单优先 `CustomForm`；列表导出用 `ExportButton`
9. Lint 以当前项目 `package.json` 为准
