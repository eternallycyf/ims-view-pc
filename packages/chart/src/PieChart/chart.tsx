import { EChartsReactProps } from 'echarts-for-react';
import { IPieChartConfig, IPieChartProps } from './interface';
import { BASE_CONFIG as BASECONFIG, defaultFormatColor, renderTooltip } from './utils';

export const getOptions = (config: IPieChartProps): EChartsReactProps['option'] => {
  const { data: DATA, baseConfig = {}, chartConfig = [] } = config;
  const BASE_CONFIG = { ...BASECONFIG, ...baseConfig };
  const CHART_CONFIG: IPieChartConfig[] = [...chartConfig];

  const solidConfig = BASE_CONFIG.IS_SOLID
    ? {}
    : {
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
      };

  return {
    color: CHART_CONFIG.map((item) => item.shapeColor),
    legend: {
      show: false,
      type: 'scroll',
      z: 999999,
      orient: 'vertical',
      left: '65%',
      top: '35%',
      textStyle: { color: '#5B6371', fontSize: 12, fontWeight: 400 },
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
    series: [
      {
        type: 'pie',
        itemStyle: {
          borderRadius: 10,
          borderWidth: 0,
          borderColor: '#fff',
        },
        textStyle: {
          color: 'transparent',
          fontSize: 12,
          fontWeight: 400,
        },
        symbol: 'circle',
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
          formatter: (config: any) => {
            return ~~config?.data?.value + (config?.data?.unitSymbol ?? '');
          },
        },
        ...solidConfig,
        data: CHART_CONFIG.filter((item) => Boolean(item.isLegend)).map((ele: any) => ({
          ...ele,
          name: ele.name,
          value: DATA[ele.dataKey],
          percent: DATA[ele.percentKey],
        })),
      },
    ],
    tooltip: {
      show: BASE_CONFIG.HAS_TOOLTIP,
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true,
        },
        shadowStyle: {
          color: BASE_CONFIG.TOOLTIP_SHADOW_COLOR,
          opacity: 0.2,
        },
      },
      padding: 0,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      confine: true,
      formatter: (params: any) => {
        const defaultDataObj = params.data;
        const value = defaultDataObj?.value ?? 0.0;
        const valueColor = defaultFormatColor({ ...defaultDataObj, value, BASE_CONFIG });

        const newObj = {
          ...defaultDataObj,
          value,
          valueColor,
        };

        return renderTooltip([newObj as any]);
      },
    },
  };
};
