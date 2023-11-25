import { EChartsReactProps } from 'echarts-for-react';
import _ from 'lodash';
import { ISunburstChartConfig, ISunburstChartProps } from './interface';
import { BASE_CONFIG as BASECONFIG, formatNumber, renderTooltip } from './utils';

export const getOptions = (config: ISunburstChartProps): EChartsReactProps['option'] => {
  const { data: DATA, baseConfig = {}, chartConfig = [] } = config;
  const BASE_CONFIG = { ...BASECONFIG, ...baseConfig };
  const CHART_CONFIG: ISunburstChartConfig[] = [...chartConfig];

  return {
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
        type: 'sunburst',
        nodeClick: false,
        center: ['50%', '50%'],
        sort: 'null',
        label: {
          route: 'tangential',
          color: '#fff',
          fontSize: 14,
          minAngle: 30,
        },
        textStyle: {
          color: 'transparent',
          fontSize: 12,
          fontWeight: 400,
        },
        levels: [
          // 这里是设置 每一层的样式，层级低于单独在data里面的
          {},
          // 设置第一层为环形
          {
            r0: '0%',
            r: '55%',
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#fff',
            },
            emphasis: {
              focus: 'descendant',
            },
          },
          {
            r0: '55%',
            r: '80%',
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#fff',
            },
            emphasis: {
              focus: 'none',
            },
          },
        ],
        data: CHART_CONFIG.map((ele: any) => ({
          ...ele,
          name: ele.fieldNames.name,
          value: DATA[ele.fieldNames.valueKey],
          percent: DATA[ele.fieldNames.percentKey],
          itemStyle: {
            color: ele.fieldNames.color,
          },
          children: ele.fieldNames.children.map((item: any) => ({
            ...item,
            name: item.name,
            value: DATA[item.valueKey],
            percent: DATA[item.percentKey],
            itemStyle: {
              color: item.color,
            },
            label: { show: false },
          })),
        })),
        ...BASE_CONFIG.SUNBURST_SERIES,
      },
    ],
    tooltip: {
      show: true,
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
        const innerNamesList = chartConfig.map((item: any) => item.fieldNames.name) || [];
        const outerNamesList =
          _.intersection(
            _.flattenDeep(
              chartConfig.map((item: any) => item.fieldNames.children.map((ele: any) => ele.name)),
            ),
          ) || [];
        const currentName = params.name;
        const isOuter = !innerNamesList.includes(currentName);
        const currentArr = [
          {
            ...params.data,
            value: formatNumber({ number: params.data?.value, isPercent: false }) || 0.0,
            percent: formatNumber({ number: params.data?.percent, isPercent: true }) || 0.0,
            unitSymbol: chartConfig[0]?.unitSymbol ?? '',
          },
        ];

        const newArr = _.flatMapDeep(
          chartConfig.map((item: any) => {
            const { fieldNames, format } = item;
            const getObj = (ele: any, group: string) => ({
              name: ele.name,
              isBlod: ele.name == group,
              group,
              valueKey: ele.valueKey,
              value: formatNumber({ number: DATA[ele.valueKey], isPercent: false }) || 0.0,
              percent: formatNumber({ number: DATA[ele.percentKey], isPercent: true }) || 0.0,
              percentKey: ele.percentKey,
              color: ele.color,
              unitSymbol: item.unitSymbol ?? '',
            });
            return [
              getObj(fieldNames, item?.fieldNames?.name),
              ...fieldNames.children.map((ele: any) => getObj(ele, item?.fieldNames?.name)),
            ];
          }),
        );
        const showArr = isOuter
          ? currentArr
          : newArr.filter((item: any) => item.group === currentName);
        return renderTooltip(showArr);
      },
    },
  };
};
