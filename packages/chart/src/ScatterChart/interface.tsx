import { CSSProperties } from 'react';
import { BASE_CONFIG } from './utils';

export type IGetScatterChartOptions = {
  data: any[];
  /**
   * @name 基础配置
   */
  baseConfig?: Partial<typeof BASE_CONFIG>;
  /**
   * @name echarts配置
   */
  chartConfig?: any;
};

export interface IScatterChartConfig {
  name: string;
  /**
   * @name 数据key
   * @required
   */
  dataKey: string;
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
   */
  isSeries: boolean;
  /**
   * @name tooltip 显示的单位
   * @default ''
   */
  unitSymbol?: string;
  /**
   * @name tooltip 及 legend 图标显示的形状
   * @default ''
   * @type rect | line | false
   */
  shape: 'rect' | 'line' | false;
  /**
   * @name 图表类型
   * @default ''
   * @enum 'bar' | 'line'
   */
  type?: 'bar' | 'line' | 'scatter';
  /**
   * @name 图表形状颜色
   * @required ''
   */
  shapeColor?: CSSProperties['color'];
  leftClassName?: string;
  rightClassName?: string;
  isBold?: boolean;
  /**
   * @name 格式化数据
   */
  format: (value: number) => number | string;
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
}
