import { IStackChartConfig as IStackChartConfig2, StackChartConfig } from '@ims-view/chart';

export const getAssetTrends = (data: any): IStackChartConfig2[] => {
  return [
    {
      name: '总资产',
      dataKey: 'totalAssets',
      isLegend: true,
      isSeries: true,
      unitSymbol: '万',
      shape: 'rect',
      type: 'bar',
      shapeColor: '#4D7FE3',
    },
    {
      name: '其他资产',
      dataKey: 'otherAssets',
      isLegend: true,
      isSeries: true,
      unitSymbol: '万',
      shape: 'rect',
      type: 'bar',
      shapeColor: '#54CFDA',
    },
    {
      name: '合计',
      dataKey: 'total',
      isLegend: false,
      isSeries: false,
      unitSymbol: '万',
      shape: false,
      hasHr: true,
      isBold: true,
    },
    {
      name: 'top',
      dataKey: 'top',
      isTopFlag: true,
      isLegend: false,
      isSeries: true,
      shape: false,
      series: {
        ...StackChartConfig.BAR_SERIES,
        data: data?.map((item: any) => ({ ...item, value: 0 })),
        label: {
          show: true,
          position: 'top',
          color: '#15181E',
          formatter: (config: any) => {
            return config?.data?.total ? config?.data?.total.toLocaleString() : '';
          },
        },
      },
    },
  ];
};
