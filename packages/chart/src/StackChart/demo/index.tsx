import { StackChart, StackChartConfig } from '@ims-view/chart';
import { useEffect, useState } from 'react';
import { getAssetTrends } from './chart';

const Demo = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const chartData2 = [
      {
        time: '2020-05-01',
        total: 100,
        otherAssets: 30,
        totalAssets: 70,
      },
      {
        time: '2021-05-01',
        total: 150,
        otherAssets: 50,
        totalAssets: 100,
      },
      {
        time: '2023-05-01',
        total: 150,
        otherAssets: -50,
        totalAssets: 200,
      },
    ];
    setChartData(chartData2);
  }, []);

  return (
    <StackChart
      data={chartData}
      chartConfig={getAssetTrends(chartData)}
      baseConfig={
        {
          GRID_CONFIG: {
            left: '3%',
            right: '5%',
            bottom: '22%',
            top: '5%',
          },
          LINE_SERIES: {
            ...StackChartConfig.LINE_SERIES,
            smooth: false,
          },
          TIME: 'time',
          HAS_DATA_ZOOM: true,
          HAS_DATA_ZOOM_LOCK: true,
          DATA_ZOOM_START_AND_END_OBJ: true,
          // DATA_ZOOM_START: '2021-01月',
          HAS_TOP_LABEL: true,
          DATA_ZOOM_START: 0,
          DATA_ZOOM_END: 100,
          TOTAL_NAME: '合计',
        } as any
      }
    />
  );
};

export default Demo;
