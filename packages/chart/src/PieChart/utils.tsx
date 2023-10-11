/* eslint-disable no-useless-escape */
import './chart.less';
import { IPieChartConfig } from './interface';

export const formatNumber = (config: { number: number; isPercent?: true }) => {
  if (config?.number == undefined) return '--';
  const { number, isPercent = true } = config;
  if (number == 0) return 0;
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
  TOOLTIP_WIDTH: 320,
  TOOLTIP_HEIGHT: 350,
  HAS_TOOLTIP: false,
  // tooltip 数值格式化颜色
  BLACK: '#2A303B',
  RED: '#E62C3B',
  GREEN: '#0FBE3F',
  TOOLTIP_SHADOW_COLOR: '#F0F6FF',
  PIE_SERIES: {
    type: 'pie',
  },
  GRID_CONFIG: {},
  GET_LEGEND_FN: (item: IPieChartConfig, data: any[]) => {
    const name = `${item.name}${item?.legendSuffix ?? ''}`;
    return {
      name,
      icon: 'circle',
    };
  },
  // 是否是实心圆
  IS_SOLID: true,
} as const;

export const renderTooltip = (
  data: (IPieChartConfig & {
    value: number;
    percent: number;
    valueColor: string;
    width: number;
    height: number;
  })[],
) => {
  return `
  <div class="tooltipBox" style=\"marginLeft: 100px\">
        <div>
          <div class="contrastContent">
            ${data
              .map((item) => {
                const left = item.shape
                  ? `<div class="${item.shape}" style=\"--color:${item.shapeColor}\"></div>`
                  : '';
                const currentValue = item?.format ? item.format(item.value) : item.value;
                const isBold = item?.isBold ? 'bold' : undefined;
                const isOnly = item?.isOnly ? 'contentCenter' : 'content';
                // const Hr = item.hasHr ? `<div class="${styles.hr}"></div>` : '';
                const currentPercent = item?.formatPercent
                  ? item.formatPercent(item.percent)
                  : item.percent;

                return `
                <div class="${isOnly}">
                  <div class="left">
                  ${left}
                  <div class="text bold ${item?.leftClassName}">${item.name}</div>
                  </div>
                </div>
                <div class="${isOnly}">
                  <div class="left">
                  <div class="text ${isBold} ${item?.leftClassName}">${item?.extraName ?? ''}</div>
                  </div>
                  <div class="right ${isBold} ${item?.rightClassName}" style=\"--color:${
                  item?.valueColor
                };\">
                    ${currentValue} ${item?.unitSymbol ?? ''}
                    </div>
                </div>
                  <div class="${isOnly}">
                  <div class="left">
                  <div class="text ${isBold} ${item?.leftClassName}">占比</div>
                  </div>
                  <div class="right ${isBold} ${item?.rightClassName}" style=\"--color:${
                  item?.valueColor
                };\">
                    ${item.percentKey ? currentPercent + '%' : ''}
                    </div>
                </div>
              `;
              })
              .join('')}
          </div>
  `;
};
