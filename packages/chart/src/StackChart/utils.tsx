/* eslint-disable no-useless-escape */
import './chart.less';
import { IBaseStackConfig, IStackChartConfig } from './interface';

export const formatNumber = (number: number, isPercent = true) => {
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

export const BASE_CONFIG: IBaseStackConfig = {
  // 时间的字段
  TIME: 'time',
  // 合计的字段
  TOTAL: 'total',
  TOTAL_NAME: '合计',
  // x轴时间格式化
  XAXIS_FORMATE_TIME: 'YYYY-MM月',
  // tooltip 时间格式化
  TOOLTIP_TIME_FORMAT: 'YYYY年MM月',
  HAS_TOP_LABEL: false,
  DYNAMICS_BAR_TOTAL: true,

  // 是否展示区域缩放滑块
  HAS_DATA_ZOOM: false,
  // 区域缩放 滑块是否可自定义拉伸大小
  HAS_DATA_ZOOM_LOCK: false,
  /**
   * @name 区域缩放-滑块初始化开始点
   * @example '2021-03月'
   */
  DATA_ZOOM_START_VALUE: '',
  // 区域缩放-滑块初始化结束点
  DATA_ZOOM_END_VALUE: '',
  DATA_ZOOM_START_AND_END_VALUE_OBJ: false,

  DATA_ZOOM_START_AND_END_OBJ: false,
  DATA_ZOOM_START: '',
  DATA_ZOOM_END: '',
  DATAZOOM_SLIDER_CONFIG: {},

  // 开启后 tooltip会开启滚动样式 TOOLTIP_WIDTH TOOLTIP_HEIGHT 会生效
  HAS_SCROLL_TOOLTIP: false,
  TOOLTIP_WIDTH: 320,
  TOOLTIP_HEIGHT: 350,
  XAXIS_NAME: '',
  YAXIS_NAME1: '',
  YAXIS_NAME2: '',

  // tooltip 数值格式化颜色
  BLACK: '#2A303B',
  RED: '#E62C3B',
  GREEN: '#0FBE3F',
  TOOLTIP_SHADOW_COLOR: '#F0F6FF',
  // 折线样式
  LINE_SERIES: {
    type: 'line',
    smooth: true,
    symbol: 'none',
    yAxisIndex: 1,
    itemStyle: {
      normal: {
        color: '#3376B5',
      },
    },
  },
  // 是否是面积图
  IS_AREA: false,
  XASIS_LABEL_FORMAT: (v: string, currentSelectedLegend: string[]) => {
    const values = v?.split('-');
    if (!Array.isArray(values)) return '--';
    if (values?.length === 0) return '--';
    return [`{a|${values[1]}}`, `{b|${values[0]}}`].join('\n');
  },
  LINE_YAXIS_LABEL: {
    formatter: (value: number) => Number(value).toFixed(2) + '%',
  },
  LINE_YAXIS: {},
  LEGEND_CONFIG: {},
  BAR_SERIES: {
    type: 'bar',
    stack: 'sum',
    barWidth: '20px',
  },
  GRID_CONFIG: {},
  GET_LEGEND_FN: (item: IStackChartConfig, data: any[]) => {
    const name = `${item.name}${item?.legendSuffix ?? ''}`;
    return {
      name,
      icon:
        item?.shape === 'rect'
          ? 'path://M80,80,h80,v80,h-80Z'
          : 'path://M0,0 L8,0 L8,1 L0,1 L0,0 Z',
    };
  },
} as const;

export const renderTooltip = (
  data: (IStackChartConfig & {
    time: string;
    total: number;
    value: number;
    valueColor: string;
    width: number;
    height: number;
    percent?: any;
  })[],
  BASE_CONFIG: any,
) => {
  const { time, width, height } = data[0];
  const hasCustomHeightAndWidth = BASE_CONFIG.HAS_SCROLL_TOOLTIP;
  const newWidth = hasCustomHeightAndWidth ? width + 'px' : width;
  const newHeight = hasCustomHeightAndWidth ? height + 'px' : height;
  let groupKeysList: any[] =
    [...new Set(data.map((item) => item?.tootipType))].filter(Boolean) || [];
  let newData =
    groupKeysList?.length > 0
      ? groupKeysList?.map((item) => {
          return data.filter((ele) => ele?.tootipType === item);
        })
      : [data];

  return `
  <div class="tooltipBox" style=\"--width:${newWidth};--height:${newHeight};marginLeft: 100px\">
        <div class="timeContent">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="calendar" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path></svg>
          <span class="time">${time}</span>
        </div>
        <div class="hr"></div>
        <div class="contrastContentCard">
        ${newData
          .map((ele, index, arr) => {
            return `
          <div class="contrastContent">
            <div class="${index + 1 != arr?.length && 'box'}">
            ${ele
              .map((item) => {
                const left = item.shape
                  ? `<div class="${item.shape}" style=\"--color:${item.shapeColor}\"></div>`
                  : '';
                const currentValue = item?.format ? item.format(item.value, item) : item.value;
                const isBold = item?.isBold ? 'bold' : undefined;
                const isOnly = item?.isOnly ? 'contentCenter' : 'content';
                const Hr = item.hasHr ? `<div class="hr"></div>` : '';
                const percent = item.formatPercent
                  ? item.formatPercent(item.percent, item)
                  : item.percent;

                return `
                <div class="${isOnly}">
                  <div class="left ${isBold}">
                  ${left}
                  <div class="text ${isBold} ${item?.leftClassName}">${item.name}</div>
                  </div>
                  <div class="right ${isBold} ${item?.rightClassName}" style=\"--color:${
                  item?.valueColor
                };\">
                    <span>${currentValue} ${item?.unitSymbol ?? ''}</span>
                    <span>${
                      item?.percentKey != undefined ? `${percent}${item.percentSymbol ?? ''}` : ''
                    } </span>
                  </div>
                </div>
                ${Hr}
              `;
              })
              .join('')}
              </div>
            </div>
          `;
          })
          .join('')}
        </div>
  </div>
  `;
};
