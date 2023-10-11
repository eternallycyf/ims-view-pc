import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { IGetStackOptions, IStackChartConfig } from './interface';
import {
  BASE_CONFIG as BASECONFIG,
  defaultFormatColor,
  formatNumber,
  renderTooltip,
} from './utils';

export const getOptions = (config: IGetStackOptions): any => {
  const { data: DATA = [], baseConfig = {}, chartConfig = {}, currentSelectedLegend = [] } = config;
  const BASE_CONFIG = { ...BASECONFIG, ...baseConfig };
  const CHART_CONFIG: IStackChartConfig[] = [...chartConfig];

  const dataZoomStartAndEndValueObj = BASE_CONFIG.DATA_ZOOM_START_AND_END_VALUE_OBJ
    ? {
        startValue: BASE_CONFIG.DATA_ZOOM_START_VALUE,
        endValue: BASE_CONFIG.DATA_ZOOM_END_VALUE,
      }
    : {};

  const dataZoomStartAndEndObj = BASE_CONFIG.DATA_ZOOM_START_AND_END_OBJ
    ? {
        start: BASE_CONFIG.DATA_ZOOM_START,
        end: BASE_CONFIG.DATA_ZOOM_END,
      }
    : {};

  const areaTooltipStyles = BASE_CONFIG.IS_AREA
    ? {
        axisPointer: {
          type: 'line',
          shadowStyle: {
            color: '#98CEFD',
            opacity: 0.2,
          },
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          confine: true,
        },
      }
    : {};

  const getAreaSeriesStyles = BASE_CONFIG.IS_AREA
    ? (color: any) => ({
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color,
        },
      })
    : () => ({});

  return {
    axisPointer: {
      type: 'cross',
      axis: 'radius',
      link: { xAxisIndex: 'all' },
      lineStyle: { type: 'dashed' },
      label: {
        backgroundColor: 'black',
        color: '#fff',
      },
    },
    legend: {
      type: 'scroll',
      z: 999999,
      textStyle: { color: '#5B6371', fontSize: 12, fontWeight: 400 },
      orient: 'horizontal',
      show: true,
      bottom: 0,
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 30,
      data: CHART_CONFIG.filter((item) => Boolean(item.isLegend)).map((item) =>
        BASE_CONFIG.GET_LEGEND_FN(item, DATA),
      ),
      ...BASE_CONFIG.LEGEND_CONFIG,
    },
    grid: {
      top: '10%',
      left: '2%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
      ...BASE_CONFIG.GRID_CONFIG,
    },
    yAxis: [
      {
        type: 'value',
        name: BASE_CONFIG.YAXIS_NAME1,
        nameLocation: 'end',
        nameTextStyle: {
          fontSize: 12,
          padding: [0, 185, 0, 0],
          color: '#B3B8C2',
        },
        position: 'right',
        show: true,
        offset: 3,
        axisLabel: {
          textStyle: {
            color: '#5B6371 ',
            fontSize: 12,
            fontWeight: 400,
          },
          ...BASE_CONFIG.LINE_YAXIS_LABEL,
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: 'rgba(239,241,244,1)',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#B3B8C2',
          },
        },
        ...BASE_CONFIG.LINE_YAXIS,
      },
      {
        type: 'value',
        position: 'left',
        name: BASE_CONFIG.YAXIS_NAME2,
        nameLocation: 'end',
        nameTextStyle: {
          fontSize: 12,
          padding: [0, 0, 0, 15],
          color: '#B3B8C2',
        },
        show: true,
        axisLabel: {
          textStyle: {
            color: '#5B6371 ',
            fontSize: 12,
            fontWeight: 400,
          },
          align: 'right',
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: 'rgba(239,241,244,1)',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#B3B8C2',
          },
        },
      },
    ],
    xAxis: {
      type: 'category',
      min: 'dataMin',
      max: 'dataMax',
      name: BASE_CONFIG.XAXIS_NAME,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'right',
        verticalAlign: 'top',
        fontSize: 12,
        padding: [30, 5, 0, 0],
        color: '#B3B8C2',
      },
      nameGap: 0,
      boundaryGap: true,
      alignWithLabel: true,
      axisLine: {
        lineStyle: {
          color: '#CACED7',
        },
      },
      axisLabel: {
        textStyle: {
          color: '#5B6371 ',
          fontSize: 12,
          fontWeight: 400,
        },
        interval: 0,
        formatter: (v: string, currentSelectedLegend: string[]) => {
          return BASE_CONFIG.XASIS_LABEL_FORMAT(v, currentSelectedLegend);
        },
        rich: {
          a: {
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#5B6371',
            lineHeight: 12,
          },
          b: {
            fontSize: 10,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#B3B8C2',
            lineHeight: 20,
          },
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed', //默认实线，dashed虚线
          width: 1,
          color: 'transparent',
        },
      },
      axisTick: {
        alignWithLabel: true,
        show: true,
      },
      data: DATA.map((item: any) => {
        return dayjs(item[BASE_CONFIG.TIME]).format(BASE_CONFIG.XAXIS_FORMATE_TIME);
      }),
    },
    dataZoom: BASE_CONFIG.HAS_DATA_ZOOM
      ? [
          {
            type: 'inside',
            zoomOnMouseWheel: 'shift',
            // 和x轴展示的格式一致
            // startValue: '2020-01月',
            // endValue: '2020-12月',
            ...dataZoomStartAndEndValueObj,
            ...dataZoomStartAndEndObj,
            top: 50,
            textStyle: {
              color: 'transparent',
              fontSize: 12,
              fontWeight: 400,
              textShadowOffsetY: 45,
              textShadowOffsetX: -45,
            },
          },
          {
            type: 'slider',
            show: true,
            y: '90%',
            top: '80%',
            brushSelect: false,
            handleIcon:
              'path://M-9.35,34.56V42m0-40V9.5m-2,0h4a2,2,0,0,1,2,2v21a2,2,0,0,1-2,2h-4a2,2,0,0,1-2-2v-21A2,2,0,0,1-11.35,9.5Z',
            dataBackground: {
              lineStyle: {
                color: '#C7DEFF',
                opacity: 1,
              },
              areaStyle: {
                color: '#E0EDFF',
              },
            },
            borderColor: '#B2CFFB',
            textStyle: {
              color: 'transparent',
              fontSize: 12,
              fontWeight: 400,
              textShadowOffsetY: 45,
              textShadowOffsetX: -45,
            },
            width: 'ph',
            height: 'ph',
            bottom: null,
            borderRadius: 3,
            backgroundColor: 'rgba(47,69,84,0)',
            fillerColor: 'rgba(145,175,274,0.2)',
            handleSize: '100%',
            handleStyle: {
              color: '#fff',
              borderColor: '#B2CFFB',
            },
            moveHandleSize: 7,
            showDetail: true,
            showDataShadow: 'auto',
            realtime: true,
            zoomLock: BASE_CONFIG.HAS_DATA_ZOOM_LOCK,
            rangeMode: 'value',
            brushStyle: {
              color: 'rgba(135,175,274,0.15)',
            },
            emphasis: {
              handleStyle: {
                borderColor: '#8Fb0F7',
              },
            },
            ...BASE_CONFIG.DATAZOOM_SLIDER_CONFIG,
          },
        ]
      : false,
    tooltip: {
      trigger: 'axis',
      renderMode: 'html',
      enterable: BASE_CONFIG.HAS_SCROLL_TOOLTIP,
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: BASE_CONFIG.TOOLTIP_SHADOW_COLOR,
          opacity: 0.2,
        },
      },
      padding: 0,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      confine: true,
      extraCssText: 'z-index: 99',
      ...areaTooltipStyles,
      formatter: (params: any) => {
        const arr = params.sort((a: any, b: any) => a.seriesIndex - b.seriesIndex);

        const time = dayjs(arr[0].data[BASE_CONFIG.TIME]).format(BASE_CONFIG.TOOLTIP_TIME_FORMAT);
        let nameList = (params || []).map((ele: any) => ele.seriesName) || [];
        let hasTotal = CHART_CONFIG.some((item) => item.name == BASE_CONFIG.TOTAL_NAME);
        const barList = (params || []).filter((item: any) => item.seriesType === 'bar') || [];

        if (hasTotal && barList.length != 0) {
          nameList = [...nameList, BASE_CONFIG.TOTAL_NAME];
        }

        const total = barList.reduce((pre: number, cru: any) => pre + (Number(cru?.value) || 0), 0);
        const defaultDataObj = arr[0].data;
        const defaultConfig = {
          time,
          total,
        };

        const newArr = CHART_CONFIG.filter((item) => Boolean(!item.isTopFlag))
          .map((item) => {
            let value = defaultDataObj[item.dataKey];
            const percentObj = item.percentKey
              ? { percent: formatNumber(defaultDataObj[item.percentKey], true) }
              : {};
            value = value ?? (item.type === 'line' ? 0.0 : undefined);
            return {
              ...item,
              ...defaultConfig,
              ...percentObj,
              name: item?.showName ?? item.name,
              valueColor: defaultFormatColor({ ...item, value, BASE_CONFIG }),
              value: item.name == BASE_CONFIG.TOTAL_NAME ? total : value,
              width: BASE_CONFIG.TOOLTIP_WIDTH,
              height: BASE_CONFIG.TOOLTIP_HEIGHT,
            };
          })
          .filter((item) =>
            BASE_CONFIG.DYNAMICS_BAR_TOTAL
              ? nameList.includes(item.name + (item.legendSuffix ?? ''))
              : true,
          );

        return renderTooltip(newArr, BASE_CONFIG);
      },
    },
    series: CHART_CONFIG.filter((item) => Boolean(item.isLegend || item.isTopFlag)).map((item) => {
      const name = `${item.name}${item?.legendSuffix ?? ''}`;
      const customProps = item.type === 'line' ? BASE_CONFIG.LINE_SERIES : BASE_CONFIG.BAR_SERIES;
      const data = DATA.map((ele: any) => ({
        ...ele,
        value: ele[item.dataKey],
        total: ele[BASE_CONFIG.TOTAL],
        time: ele[BASE_CONFIG.TIME],
      }));
      if (item.type === 'line') {
        cloneDeep(data)
          .reverse()
          .some((item) => {
            if (item.value == undefined) {
              data.pop();
            }
            return item.value;
          });
      }

      return {
        ...item,
        ...customProps,
        name,
        yAxisIndex: item.type === 'line' ? '0' : '1',
        lineStyle: { color: item.shapeColor },
        itemStyle: { color: item.shapeColor },
        textStyle: {
          color: 'transparent',
          fontSize: 12,
          fontWeight: 400,
        },
        smooth: false,
        symbol: 'none',
        label: {
          show: false,
          rotate: 0,
          position: 'top',
          distance: -10,
          textStyle: {
            color: '#5B6371',
            fontSize: 12,
            fontWeight: 400,
          },
          formatter: (config: any) =>
            formatNumber(config.data[item.dataKey]) + (item?.unitSymbol ?? ''),
        },
        markLine: {
          animation: false,
          lineStyle: {
            type: 'solid',
            width: 1,
            color: '#CACED7',
          },
          label: {
            show: false,
          },
          symbol: ['none', 'none'],
          silent: true,
          data: [
            {
              yAxis: 0,
            },
          ],
        },
        ...getAreaSeriesStyles(item.shapeColor),
        data,
        ...(item.series || {}),
      };
    }),
  };
};
