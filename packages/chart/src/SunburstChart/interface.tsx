import { CSSProperties } from 'react';
import { BASE_CONFIG } from './utils';

export type SunburstChartConfig = {
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
