import { CSSProperties } from 'react';
import { BASE_CONFIG } from './utils';

export type IGetStackOptions = {
  data: any[];
  /**
   * @name 基础配置
   */
  baseConfig?: Partial<typeof BASE_CONFIG>;
  /**
   * @name echarts配置
   */
  chartConfig?: any;
  style?: CSSProperties;
  currentSelectedLegend?: string[];
};

export interface IStackChartConfig {
  name: string;
  /**
   * 当showName和name不一致时，showName会显示在tooltip中
   */
  showName?: string;
  /**
   * @name 数据key
   * @required
   */
  dataKey: string;
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
  shape: 'rect' | 'line' | false;
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
