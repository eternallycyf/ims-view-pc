/* eslint-disable no-useless-escape */
import './chart.less';
import { IScatterChartConfig } from './interface';

export const formatNumber = ({
  number,
  isPercent = true,
}: {
  number: number;
  isPercent?: true;
}) => {
  if (number == 0) return 0;
  if (number == undefined) return '--';
  if (!number) return '--';
  if (isPercent) {
    const haveDecimal = /\./.test((number * 100).toString());
    return haveDecimal ? (Number(number) * 100).toFixed(2) : number * 100;
  }
  const haveDecimal = /\./.test(number.toString());
  return haveDecimal ? Number(number).toFixed(2) : number;
};

export const defaultFormatColor = ({ formatColor, value, BASE_CONFIG }: any) => {
  const hasFormatColor = formatColor && typeof formatColor === 'function';
  let valueColor = '';
  if (hasFormatColor) {
    valueColor = formatColor(value);
  } else {
    valueColor =
      value == 0 || value == '0.00'
        ? BASE_CONFIG.BLACK
        : value > 0
        ? BASE_CONFIG.RED
        : BASE_CONFIG.GREEN;
  }
  return valueColor;
};

export const BASE_CONFIG = {
  // 时间的字段
  TIME: 'time',
  // 合计的字段
  TOTAL: 'total',
  // x轴时间格式化
  XAXIS_FORMATE_TIME: 'YYYY-MM月',
  // tooltip 时间格式化
  TOOLTIP_TIME_FORMAT: 'YYYY-MM月',
  TOOLTIP_WIDTH: 320,
  TOOLTIP_HEIGHT: 350,
  // tooltip 数值格式化颜色
  BLACK: '#2A303B',
  RED: '#E62C3B',
  GREEN: '#0FBE3F',
  TOOLTIP_SHADOW_COLOR: '#F0F6FF',

  XAXIS_NAME: '',
  YAXIS_NAME: '',

  // 折线样式
  LINE_SERIES: {
    type: 'line',
    smooth: true,
    symbol: 'none',
    showSymbol: false,
    yAxisIndex: 1,
    itemStyle: {
      normal: {
        color: '#3376B5',
      },
    },
  },
  BAR_SERIES: {
    type: 'bar',
    stack: 'sum',
    barWidth: '20px',
  },
  SCATTER_SERIES: {
    type: 'scatter',
    emphasis: {
      label: {
        show: false,
      },
      itemStyle: {
        color: 'rgba(2,119,249,0.8)',
        shadowColor: '0px 0px 8px 0px rgba(2,119,249,0.46)',
      },
    },
  },
  GRID_CONFIG: {},
  GET_LEGEND_FN: (item: IScatterChartConfig, data: any[]) => {
    const name = `${item.name}${item?.legendSuffix ?? ''}`;
    return {
      name,
      // icon: item?.shape,
      icon: item?.shape === 'rect' ? 'path://M80,80,h80,v80,h-80Z' : item?.shape,
    };
  },
  RENDER_TOOLTIP_FN: (data: any[]) => data,
} as const;

export const renderTooltip = (
  data: (IScatterChartConfig & {
    time: string;
    total: number;
    value: number;
    valueColor: string;
    width: number;
    height: number;
  })[],
) => {
  const { total, time, width, height } = data[0];
  return `
  <div class="tooltipBox" style=\"--width:${width};--height:${height};marginLeft: 100px\">
        <div>
          <div class="contrastContent">
            ${data
              .map((item) => {
                const left = item.shape
                  ? `<div class="${item.shape}" style=\"--color:${item.shapeColor}\"></div>`
                  : '';
                const currentValue = item?.format ? item.format(item.value) : item.value;
                const isBold = item?.isBold ? 'isBold' : undefined;
                const isOnly = item?.isOnly ? 'contentCenter' : 'content';
                const Hr = item.hasHr ? `<div class="hr"></div>` : '';
                return `
                <div class="${isOnly}">
                  <div class="left ${isBold}">
                  ${left}
                  <div class="text ${isBold} ${item?.leftClassName}">${item.name}</div>
                  </div>
                  <div class="right ${isBold} ${item?.rightClassName}" style=\"--color:${
                  item?.valueColor
                };\">
                    ${currentValue} ${item?.unitSymbol ?? ''}
                    </div>
                </div>
                ${Hr}
              `;
              })
              .join('')}
          </div>
  `;
};
