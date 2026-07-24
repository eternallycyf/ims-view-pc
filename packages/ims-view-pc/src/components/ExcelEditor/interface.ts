import type { FUniver, IWorkbookData } from '@univerjs/presets';
import type { CSSProperties } from 'react';

/** 功能档位：simple 核心+插入+导入导出；all 开启开源能力；custom 按 features 勾选 */
export type ExcelEditorFeatureMode = 'simple' | 'all' | 'custom';

/** 视图模式：preview 只读；edit 可编辑 */
export type ExcelEditorViewMode = 'preview' | 'edit';

/** @deprecated 请使用 ExcelEditorViewMode；保留别名避免旧引用报错 */
export type ExcelEditorMode = ExcelEditorViewMode;

/** custom 模式下可开关的开源能力（不含商业版） */
export type ExcelEditorFeatures = {
  /** 图片 / 绘图 */
  drawing?: boolean;
  /** 筛选 */
  filter?: boolean;
  /** 排序 */
  sort?: boolean;
  /** 条件格式 */
  conditionalFormatting?: boolean;
  /** 数据验证 */
  dataValidation?: boolean;
  /** 超链接 */
  hyperLink?: boolean;
  /** 查找替换 */
  findReplace?: boolean;
  /** 批注备注 */
  note?: boolean;
  /** 表格 */
  table?: boolean;
  /** 评论线程 */
  threadComment?: boolean;
};

export interface ExcelEditorHandle {
  /** 获取 Univer Facade API */
  getUniverAPI: () => FUniver | null;
  /** 获取当前工作簿快照数据 */
  getWorkbookData: () => Partial<IWorkbookData> | null;
  /** 导入 xlsx（默认本地；配置了 exchangeEndpoint 则走服务端） */
  importXlsx: (file: File) => Promise<Partial<IWorkbookData>>;
  /** 导出 xlsx（始终浏览器本地生成） */
  exportXlsx: (fileName?: string) => Promise<void>;
}

export interface ExcelEditorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * 容器高度；不传时默认 `100%` 跟随父级高度（父级需有明确高度，如 flex 布局 / `height: 100vh`）
   */
  height?: number | string;
  /**
   * 容器宽度；不传时默认 `100%` 跟随父级宽度
   */
  width?: number | string;
  /**
   * 功能档位
   * - simple: 核心编辑 + 插入 + 导入导出（默认，无公式栏/数据能力）
   * - all: 开启开源能力（评论默认关，可用 features.threadComment 打开）
   * - custom: 按 features 勾选
   * @default 'simple'
   */
  mode?: ExcelEditorFeatureMode;
  /**
   * custom 模式下启用的能力；
   * mode=all 时仅 `threadComment` 可覆盖默认值
   */
  features?: ExcelEditorFeatures;
  /**
   * 视图模式：preview 只读预览；edit 可编辑
   * @default 'edit'
   */
  viewMode?: ExcelEditorViewMode;
  /** Excel 文件地址，与 data 二选一，data 优先级更高 */
  src?: string;
  /** 工作簿数据，优先级高于 src */
  data?: Partial<IWorkbookData>;
  /**
   * Nest 导入服务地址。配置后：上传 → 服务端异步解析（小文件 LuckyExcel snapshot /
   * 大文件 ExcelJS Worker 分块）→ 轮询并挂载。未配置时本地导入（≤5MB）。导出始终本地。
   * @example 'http://localhost:3010'
   */
  exchangeEndpoint?: string;
  /**
   * 是否在 Ribbon「导入导出」页签展示导入/导出按钮（仅编辑视图）
   * 未传时：编辑视图默认 true
   */
  showExchange?: boolean;
  /** 初始化完成回调 */
  onReady?: (univerAPI: FUniver) => void;
  /** 加载或渲染失败回调 */
  onError?: (error: Error) => void;
}
