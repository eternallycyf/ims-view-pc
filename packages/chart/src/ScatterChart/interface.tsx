import { CSSProperties } from 'react';

export interface IBaseScatterConfig {
  /**
   * Time field
   * @default 'time'
   * @type {string}
   */
  TIME?: string;

  /**
   * Total field
   * @default 'total'
   * @type {string}
   */
  TOTAL?: string;

  /**
   * X-axis time format
   * @default 'YYYY-MM月'
   * @type {string}
   */
  XAXIS_FORMATE_TIME?: string;

  /**
   * Tooltip time format
   * @default 'YYYY-MM月'
   * @type {string}
   */
  TOOLTIP_TIME_FORMAT?: string;

  /**
   * Tooltip width
   * @default 320
   * @type {number}
   */
  TOOLTIP_WIDTH?: number;

  /**
   * Tooltip height
   * @default 350
   * @type {number}
   */
  TOOLTIP_HEIGHT?: number;

  /**
   * Black color code
   * @default '#2A303B'
   * @type {string}
   */
  BLACK?: string;

  /**
   * Red color code
   * @default '#E62C3B'
   * @type {string}
   */
  RED?: string;

  /**
   * Green color code
   * @default '#0FBE3F'
   * @type {string}
   */
  GREEN?: string;

  /**
   * Tooltip shadow color
   * @default '#F0F6FF'
   * @type {string}
   */
  TOOLTIP_SHADOW_COLOR?: string;

  /**
   * X-axis name
   * @default ''
   * @type {string}
   */
  XAXIS_NAME?: string;

  /**
   * Y-axis name
   * @default ''
   * @type {string}
   */
  YAXIS_NAME?: string;

  /**
   * Line series configuration
   * @type {object}
   */
  LINE_SERIES?: {
    type: string;
    smooth: boolean;
    symbol: string;
    showSymbol: boolean;
    yAxisIndex: number;
    itemStyle: {
      normal: {
        color: string;
      };
    };
  };

  /**
   * Bar series configuration
   * @type {object}
   */
  BAR_SERIES?: {
    type: string;
    stack: string;
    barWidth: string;
  };

  /**
   * Scatter series configuration
   * @type {object}
   */
  SCATTER_SERIES?: {
    type: string;
    emphasis: {
      label: {
        show: boolean;
      };
      itemStyle: {
        color: string;
        shadowColor: string;
      };
    };
  };

  /**
   * Grid configuration
   * @type {object}
   */
  GRID_CONFIG?: object;

  /**
   * Function to get legend
   * @type {Function}
   */
  GET_LEGEND_FN?: (item: IScatterChartConfig, data: any[]) => object;

  /**
   * Function to render tooltip
   * @type {Function}
   */
  RENDER_TOOLTIP_FN?: (data: any[]) => any[];
}

export type IScatterChartProps = {
  data: any[];
  /**
   * @name 基础配置
   */
  baseConfig?: IBaseScatterConfig;
  /**
   * @name echarts配置
   */
  chartConfig?: IScatterChartConfig[];
  style?: CSSProperties;
};

export interface IScatterChartConfig {
  name?: string;
  /**
   * @name 数据key
   * @required
   */
  dataKey?: string;
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
   */
  isSeries?: boolean;
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
  shape?: 'rect' | 'line' | false;
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
  format?: (value: number) => number | string;
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
