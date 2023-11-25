import { CSSProperties } from 'react';

export interface IBaseSunburstChartConfig {
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
   * @name tooltip阴影颜色
   * @default '#F0F6FF'
   * @type {string}
   */
  TOOLTIP_SHADOW_COLOR?: string;
  /**
   * @name 饼图配置
   * @default {}
   * @type {object}
   */
  SUNBURST_SERIES?: any;
  /**
   * @name grid配置
   * @default {}
   * @type {object}
   */
  GRID_CONFIG?: any;
}

export type ISunburstChartProps = {
  data: any;
  /**
   * @name 基础配置
   */
  baseConfig?: IBaseSunburstChartConfig;
  /**
   * @name echarts配置
   */
  chartConfig?: ISunburstChartConfig[];
  style?: CSSProperties;
};

interface fieldNames {
  name: string;
  valueKey: string | number;
  percentKey: string | number;
  color: CSSProperties['color'];
  children?: Omit<fieldNames, 'children'>[];
}

export interface ISunburstChartConfig {
  /**
   * @name 数据key
   * @required
   */
  fieldNames: fieldNames;
  /**
   * @name tooltip 显示的单位
   * @default ''
   */
  unitSymbol?: string;
}
