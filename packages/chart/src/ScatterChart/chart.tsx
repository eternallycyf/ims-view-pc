import dayjs from 'dayjs';
import { EChartsReactProps } from 'echarts-for-react';
import ecStat from 'echarts-stat';
import { IScatterChartConfig, IScatterChartProps } from './interface';
import {
  BASE_CONFIG as BASECONFIG,
  defaultFormatColor,
  formatNumber,
  renderTooltip,
} from './utils';

export const getOptions = (config: IScatterChartProps): EChartsReactProps['option'] => {
  const { data: _data = [], baseConfig = {}, chartConfig = [] } = config;
  const BASE_CONFIG = { ...BASECONFIG, ...baseConfig };
  const CHART_CONFIG: IScatterChartConfig[] = [...chartConfig];

  const DATA = _data.map((item) => {
    return chartConfig.map((ele: any) => item[ele.dataKey]);
  });
  // See https://github.com/ecomfe/echarts-stat
  const myRegression = ecStat.regression('linear', DATA, 0);
  myRegression.points.sort(function (a, b) {
    return a[0] - b[0];
  });

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
      itemGap: 30,
      data: CHART_CONFIG.filter((item) => item.isLegend).map((item) =>
        BASE_CONFIG.GET_LEGEND_FN(item, DATA),
      ),
    },
    grid: {
      top: '10%',
      left: '2%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
      ...BASE_CONFIG.GRID_CONFIG,
    },
    yAxis: {
      type: 'value',
      name: BASE_CONFIG.YAXIS_NAME,
      nameLocation: 'end',
      nameTextStyle: {
        fontSize: 12,
        padding: [0, 0, 0, 15],
        color: '#B3BBc2',
      },
      position: 'left',
      show: true,
      axisLabel: {
        textStyle: {
          color: '#5B6371 ',
          fontSize: 12,
          fontWeight: 400,
        },
        // formatter: (value: number) => ~~Number(value),
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
          // color: 'transparent',
        },
      },
    },
    xAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      name: BASE_CONFIG.XAXIS_NAME,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'right',
        verticalAlign: 'top',
        fontSize: 12,
        padding: [30, 5, 0, 0],
        color: '#B3BBC2',
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
        // formatter: (value: number) => ~~Number(value),
        // formatter: (v: string) => {
        //   const values = v?.split('-');
        //   if (!Array.isArray(values)) return '--';
        //   if (values?.length === 0) return '--';
        //   return [`{a|${values[1]}}`, `{b|${values[0]}}`].join('\n');
        // },
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
      },
      data: DATA.map((item: any) => {
        return dayjs(item[BASE_CONFIG.TIME]).format(BASE_CONFIG.XAXIS_FORMATE_TIME);
      }),
    },
    series: CHART_CONFIG.filter((item) => Boolean(item.isSeries)).map((item) => {
      const name = `${item.name}${item?.legendSuffix ?? ''}`;
      const customSeries = {
        line: BASE_CONFIG.LINE_SERIES,
        bar: BASE_CONFIG.BAR_SERIES,
        scatter: BASE_CONFIG.SCATTER_SERIES,
      };
      const customProps = customSeries[item.type as keyof typeof customSeries];

      if (item.type === 'line')
        return {
          name: 'line',
          type: 'line',
          symbol: 'none',
          showSymbol: false,
          lineStyle: { color: item.shapeColor },
          itemStyle: { color: item.shapeColor },
          textStyle: {
            color: 'transparent',
            fontSize: 12,
            fontWeight: 400,
          },
          data: myRegression.points,
        };

      return {
        ...item,
        ...customProps,
        name,
        lineStyle: { color: item.shapeColor },
        itemStyle: { color: item.shapeColor },
        textStyle: {
          color: 'transparent',
          fontSize: 12,
          fontWeight: 400,
        },
        symbol: 'circle',
        symbolSize: 8,
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
            formatNumber({ number: config.data[item.dataKey] as number }) +
            (item?.unitSymbol ?? ''),
        },
        data: DATA,
        ...(item.series || {}),
      };
    }),
    tooltip: {
      trigger: 'axis',
      renderMode: 'html',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: BASE_CONFIG.TOOLTIP_SHADOW_COLOR,
          opacity: 0.2,
        },
      },
      padding: 0,
      backgroundColor: '#transparent',
      borderColor: 'transparent',
      confine: true,
      formatter: (params: any) => {
        const arr = params.sort((a: any, b: any) => a.seriesIndex - b.seriesIndex);
        const time = dayjs(arr[0].data[BASE_CONFIG.TIME]).format(BASE_CONFIG.TOOLTIP_TIME_FORMAT);
        const total = arr[0]?.data[BASE_CONFIG.TOTAL];
        const defaultDataObj = arr[0].data;
        const defaultConfig = {
          time,
          total,
        };
        const newArr = CHART_CONFIG.filter((item) => Boolean(!item.isTopFlag)).map(
          (item, index) => {
            let value = defaultDataObj[item.dataKey];
            value = value ?? (item.type === 'line' ? 0.0 : undefined);
            return {
              ...item,
              ...defaultConfig,
              valueColor: defaultFormatColor({ ...item, value, BASE_CONFIG }),
              value: arr[0].value[index],
              width: BASE_CONFIG.TOOLTIP_WIDTH,
              height: BASE_CONFIG.TOOLTIP_HEIGHT,
            };
          },
        );
        return renderTooltip(BASE_CONFIG.RENDER_TOOLTIP_FN(newArr).filter(Boolean));
      },
    },
  };
};
