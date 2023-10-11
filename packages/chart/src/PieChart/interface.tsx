import { CSSProperties } from 'react';
import { BASE_CONFIG } from './utils';

export type IGetPieChartOptions = {
  data: any;
  /**
   * @name 基础配置
   */
  baseConfig?: Partial<typeof BASE_CONFIG>;
  /**
   * @name echarts配置
   */
  chartConfig?: any;
  style?: CSSProperties;
  emptyStyle?: CSSProperties;
};

export interface IPieChartConfig {
  name: string;
  /**
   * @name tooltipName
   * @required
   */
  extraName?: string;
  /**
   * @name 数据key
   * @required
   */
  dataKey: string;
  percentKey?: string;
  /**
   * @name 是否显示在图例中
   * @required
   */
  isLegend: boolean;
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
  isSeries: boolean;
  /**
   * @name tooltip 显示的单位
   * @default ''
   */
  unitSymbol?: string;
  /**
   * @name tooltip 及 legend 图标显示的形状
   * @type 'pie'
   * @default 'pie'
   */
  shape?: 'pie';
  /**
   * @name 图表类型
   * @type 'bar'
   * @type 'line
   * @default ''
   */
  type?: 'pie';
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
  format?: (value: number) => number | string;
  formatPercent?: (value: number) => number | string;
  /**
   * @name 自定义格式化 tooltip 数字颜色 如果大于0 显示红色，小于0显示绿色...
   * @default (val) => val === 0 ? '#2A303B' : (val > 0 ? '#E62C3B' : '#0FBE3F') : '#2A3038'
   */
  formatColor?: (val: number) => CSSProperties['color'];
  /**
   * @name 一行是否只有一个 Name 没有value 则居中显示
   * @default false
   */
  isOnly?: boolean;
}
