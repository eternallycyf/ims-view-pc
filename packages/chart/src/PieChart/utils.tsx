/* eslint-disable no-useless-escape */
import './chart.less';
import { IBaseConfig, IPieChartConfig } from './interface';

/**
 * Format a number according to the provided configuration.
 *
 * @function
 * @param {Object} config - The configuration object.
 * @param {number} config.number - The number to be formatted.
 * @param {boolean} [config.isPercent=true] - Indicates whether the number represents a percentage.
 * @returns {string|number} The formatted number or '--' if the input is undefined.
 *
 * @example
 * // Format a number as a percentage with two decimal places
 * const result = formatNumber({ number: 0.123, isPercent: true });
 * // Output: '12.30%'
 *
 * @example
 * // Format a regular number with two decimal places
 * const result = formatNumber({ number: 123.456, isPercent: false });
 * // Output: '123.46'
 */
export const formatNumber = (config: { number: number; isPercent?: boolean }) => {
  // Return '--' if the input number is undefined
  if (config?.number == undefined) return '--';

  // Destructure the configuration object
  const { number, isPercent = true } = config;

  // Return 0 if the number is 0
  if (number === 0) return 0;

  // Return '--' if the number is falsy (excluding 0)
  if (!number) return '--';

  // Check if the number is a percentage
  if (isPercent) {
    // Check if the percentage has decimal places
    const haveDecimal = /\./.test((number * 100).toString());

    // Format the percentage with two decimal places if necessary
    return haveDecimal ? (Number(number) * 100).toFixed(2) : number * 100;
  }

  // Check if the regular number has decimal places
  const haveDecimal = /\./.test(number.toString());

  // Format the regular number with two decimal places if necessary
  return haveDecimal ? Number(number).toFixed(2) : number;
};

export const defaultFormatColor = ({
  formatColor,
  value,
  BASE_CONFIG,
}: {
  formatColor?: (value: number) => string;
  value: any;
  BASE_CONFIG: IBaseConfig;
}) => {
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

export const BASE_CONFIG: Partial<IBaseConfig> = {
  /**
   * @name TOOLTIP_WIDTH
   * @type number
   * @default 320
   * @description The width of the tooltip.
   */
  TOOLTIP_WIDTH: 320,

  /**
   * @name TOOLTIP_HEIGHT
   * @type number
   * @default 350
   * @description The height of the tooltip.
   */
  TOOLTIP_HEIGHT: 350,

  /**
   * @name HAS_TOOLTIP
   * @type boolean
   * @default false
   * @description Indicates whether tooltip is enabled.
   */
  HAS_TOOLTIP: false,

  /**
   * @name BLACK
   * @type string
   * @default '#2A303B'
   * @description Color code for black.
   */
  BLACK: '#2A303B',

  /**
   * @name RED
   * @type string
   * @default '#E62C3B'
   * @description Color code for red.
   */
  RED: '#E62C3B',

  /**
   * @name GREEN
   * @type string
   * @default '#0FBE3F'
   * @description Color code for green.
   */
  GREEN: '#0FBE3F',

  /**
   * @name TOOLTIP_SHADOW_COLOR
   * @type string
   * @default '#F0F6FF'
   * @description Color code for tooltip shadow.
   */
  TOOLTIP_SHADOW_COLOR: '#F0F6FF',

  /**
   * @name PIE_SERIES
   * @type Object
   * @description Configuration for pie series.
   */
  PIE_SERIES: {
    /**
     * @name type
     * @type string
     * @default 'pie'
     * @description The type of the pie series.
     */
    type: 'pie',
  },

  /**
   * @name GRID_CONFIG
   * @type Object
   * @default {}
   * @description Configuration for grid.
   * Note: The type is set to 'any' for flexibility. Please provide a more specific type if possible.
   */
  GRID_CONFIG: {},

  /**
   * @name GET_LEGEND_FN
   * @type function
   * @description Function to get legend information.
   * @param {IPieChartConfig} item - The pie chart config item.
   * @param {any[]} data - The data array.
   * @returns {Object} Legend information.
   * @returns {string} name - The name of the legend.
   * @returns {string} icon - The icon for the legend.
   */
  GET_LEGEND_FN: (item, data) => {
    const name = `${item.name}${item?.legendSuffix ?? ''}`;
    return {
      name,
      icon: 'circle',
    };
  },

  /**
   * @name IS_SOLID
   * @type boolean
   * @default true
   * @description Indicates whether the pie chart is solid.
   */
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
