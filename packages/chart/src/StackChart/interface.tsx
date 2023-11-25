import { CSSProperties } from 'react';
import { BASE_CONFIG } from './utils';

export interface IBaseStackConfig {
  /**
   * @name 时间的字段
   * @default 'time'
   * @type {string}
   */
  TIME?: string;
  /**
   * @name 合计的字段
   * @default 'total'
   * @type {string}
   */
  TOTAL?: string;
  /**
   * @name 合计的名称
   * @default '合计'
   * @type {string}
   */
  TOTAL_NAME?: string;
  /**
   * @name x轴时间格式化
   * @default 'YYYY-MM月'
   * @type {string}
   */
  XAXIS_FORMATE_TIME?: string;
  /**
   * @name tooltip 时间格式化
   * @default 'YYYY年MM月'
   * @type {string}
   */
  TOOLTIP_TIME_FORMAT?: string;
  /**
   * @name 是否展示顶部总和
   * @default false
   * @type {boolean}
   */
  HAS_TOP_LABEL?: boolean;
  /**
   * @name 是否展示动态柱状图总和
   * @default true
   * @type {boolean}
   */
  DYNAMICS_BAR_TOTAL?: boolean;
  /**
   * @name 是否展示区域缩放滑块
   * @default false
   * @type {boolean}
   */
  HAS_DATA_ZOOM?: boolean;
  /**
   * @name 区域缩放 滑块是否可自定义拉伸大小
   * @default false
   * @type {boolean}
   */
  HAS_DATA_ZOOM_LOCK?: boolean;
  /**
   * @name 区域缩放-滑块初始化开始点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_START_VALUE?: string;
  /**
   * @name 区域缩放-滑块初始化结束点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_END_VALUE?: string;
  /**
   * @name 区域缩放-滑块初始化开始点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_START?: string | number;
  /**
   * @name 区域缩放-滑块初始化结束点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_END?: string | number;
  /**
   * @name 区域缩放-滑块初始化开始点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_START_AND_END_VALUE_OBJ?: boolean;
  /**
   * @name 区域缩放-滑块初始化开始点
   * @default ''
   * @type {string}
   */
  DATA_ZOOM_START_AND_END_OBJ?: boolean;
  /**
   * @name 区域缩放-滑块初始化开始点
   * @default {}
   * @type {string}
   */
  DATAZOOM_SLIDER_CONFIG?: any;
  /**
   * @name 开启后 tooltip会开启滚动样式 TOOLTIP_WIDTH TOOLTIP_HEIGHT 会生效
   * @default false
   * @type {boolean}
   */
  HAS_SCROLL_TOOLTIP?: boolean;
  /**
   * @name tooltip宽度
   * @default 320
   * @type {number}
   */
  TOOLTIP_WIDTH?: number;
  /**
   * @name tooltip高度
   * @default 350
   * @type {number}
   */
  TOOLTIP_HEIGHT?: number;
  /**
   * @name x轴名称
   * @default ''
   * @type {string}
   */
  XAXIS_NAME?: string;
  /**
   * @name y轴名称
   * @default ''
   * @type {string}
   */
  YAXIS_NAME1?: string;
  /**
   * @name y轴名称
   * @default ''
   * @type {string}
   */
  YAXIS_NAME2?: string;
  /**
   * @name tooltip 数值格式化颜色
   * @default '#2A303B'
   * @type {string}
   */
  BLACK?: string;
  /**
   * @name tooltip 数值格式化颜色
   * @default '#E62C3B'
   * @type {string}
   */
  RED?: string;
  /**
   * @name tooltip 数值格式化颜色
   * @default '#0FBE3F'
   * @type {string}
   */
  GREEN?: string;
  /**
   * @name tooltip 数值格式化颜色
   * @default '#F0F6FF'
   * @type {string}
   */
  TOOLTIP_SHADOW_COLOR?: string;
  LINE_SERIES: any;
  /**
   * @name 是否是面积图
   * @default false
   * @type {boolean}
   */
  IS_AREA?: boolean;
  /**
   * @name x轴label格式化
   * @default (v: string, currentSelectedLegend: string[]) => {
   *   const values = v?.split('-');
   *   if (!Array.isArray(values)) return '--';
   *   if (values?.length === 0) return '--';
   *   return [`{a|${values[1]}}`, `{b|${values[0]}}`].join('\n');
   * }
   * @type {Function}
   */
  XASIS_LABEL_FORMAT?: (v: string, currentSelectedLegend: string[]) => string;
  /**
   * @name 折线图y轴label格式化
   * @default (value: number) => Number(value).toFixed(2) + '%'
   * @type {Function}
   */
  LINE_YAXIS_LABEL?: any;
  /**
   * @name 折线图y轴配置
   * @default {}
   * @type {Object}
   */
  LINE_YAXIS?: Object;
  /**
   * @name 图例配置
   * @default {}
   * @type {Object}
   */
  LEGEND_CONFIG?: Object;
  /**
   * @name 柱状图配置
   * @default {
   *   type: 'bar',
   *   stack: 'sum',
   *   barWidth: '20px',
   * }
   * @type {Object}
   */
  BAR_SERIES?: Object;
  /**
   * @name 图表配置
   * @default {}
   * @type {Object}
   */
  GRID_CONFIG?: Object;
  /**
   * @name 获取图例配置
   * @default (item: IStackChartConfig, data: any[]) => {
   *   const name = `${item.name}${item?.legendSuffix ?? ''}`;
   *   return {
   *     name,
   *     icon:
   *       item?.shape === 'rect'
   *         ? 'path://M80,80,h80,v80,h-80Z'
   *         : 'path://M0,0 L8,0 L8,1 L0,1 L0,0 Z',
   *   };
   * }
   * @type {Function}
   */
  GET_LEGEND_FN?: (item: IStackChartConfig, data: any[]) => Object;
}

export type IStackChartProps = {
  data: any[];
  /**
   * @name 基础配置
   */
  baseConfig?: IBaseStackConfig;
  /**
   * @name echarts配置
   */
  chartConfig?: IStackChartConfig[];
  style?: CSSProperties;
  currentSelectedLegend?: string[];
};

export interface IStackChartConfig {
  name?: string;
  /**
   * 当showName和name不一致时，showName会显示在tooltip中
   */
  showName?: string;
  /**
   * @name 数据key
   * @required
   */
  dataKey?: string;
  /**
   * @name 百分比字段 添加了就会出现在tooltip中
   */
  percentKey?: string;
  /**
   * @name 是否显示在图例中
   * @required
   */
  isLegend?: boolean;
  /**
   * @name 图例name额外后缀
   * @default ''
   */
  legendSuffix?: string;
  /**
   * @name 是否显示在series中
   * @deprecated
   * @todo 暂时根据 isLegend 判断 只有 isLegend 为 true 时才显示在 series 中
   */
  isSeries?: boolean;
  /**
   * @name tooltip 显示的单位
   * @default ''
   */
  unitSymbol?: string;
  percentSymbol?: string;
  /**
   * @name tooltip 及 legend 图标显示的形状
   * @default ''
   * @type rect | line | false
   */
  shape?: 'rect' | 'line' | false;
  /**
   * @name 图表类型
   * @default ''
   * @type 'bar' | 'line'
   */
  type?: 'bar' | 'line';
  /**
   * @name 图表形状颜色
   */
  shapeColor?: CSSProperties['color'];
  leftClassName?: string;
  rightClassName?: string;
  isBold?: boolean;
  /**
   * @name 格式化数据
   */
  format?: (value: number, record: any) => number | string;
  formatPercent?: (value: number, record: any) => number | string;
  /**
   * @name 自定义格式化 tooltip 数字颜色 如果大于0 显示红色，小于0显示绿色...
   * @default (val) => val === 0 ? '#2A303B' : (val > 0 ? '#E62C3B' : '#0FBE3F') : '#2A3038'
   */
  formatColor?: (val: number) => CSSProperties['color'];
  hasHr?: boolean;
  /**
   * @name 是否为上方显示的tag
   * @default false
   */
  isTopFlag?: boolean;
  /**
   * @name 自定义series
   */
  series?: Object;
  /**
   * @name 一行是否只有一个 Name 没有value 则居中显示
   * @default false
   */
  isOnly?: boolean;
  tootipType?: string | number;
}
