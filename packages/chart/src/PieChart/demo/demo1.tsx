import { PieChart } from '@ims-view/chart';
import { useEffect, useState } from 'react';

const configurations = [
  {
    name: '数学',
    extraName: '课程',
    dataKey: 'fundBal',
    percentKey: 'fundBalQmRatio',
    isLegend: true,
    isSeries: true,
    unitsymbol: '$',
    shape: 'pie' as const,
    type: 'pie' as const,
    shapeColor: '#4D7FE3',
    formatColor: () => '#2A303B',
  },
  {
    name: '英语',
    extraName: '课程',
    dataKey: 'fundBal1',
    percentKey: 'fundBalQmRatio1',
    isLegend: true,
    isSeries: true,
    unitsymbol: '$',
    shape: 'pie' as const,
    type: 'pie' as const,
    shapeColor: '#F05A75',
    formatColor: () => '#2A303B',
  },
  {
    name: '语文',
    extraName: '课程',
    dataKey: 'fundBal2',
    percentKey: 'fundBalQmRatio2',
    isLegend: true,
    isSeries: true,
    unitsymbol: '$',
    shape: 'pie' as const,
    type: 'pie' as const,
    shapeColor: '#67C7E5',
    formatColor: () => '#2A303B',
  },
  {
    name: '物理',
    extraName: '课程',
    dataKey: 'fundBal3',
    percentKey: 'fundBalQmRatio3',
    isLegend: true,
    isSeries: true,
    unitsymbol: '$',
    shape: 'pie' as const,
    type: 'pie' as const,
    shapeColor: '#78C850',
    formatColor: () => '#2A303B',
  },
  {
    name: '化学',
    extraName: '课程',
    dataKey: 'fundBal4',
    percentKey: 'fundBalQmRatio4',
    isLegend: true,
    isSeries: true,
    unitsymbol: '$',
    shape: 'pie' as const,
    type: 'pie' as const,
    shapeColor: '#FFD700',
    formatColor: () => '#2A303B',
  },
];

const App = () => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    setChartData({
      monthId: '202305',
      fundBal: 100,
      fundBalQmRatio: 0.1,
      fundBal1: 200,
      fundBalQmRatio1: 0.2,
      fundBal2: 300,
      fundBalQmRatio2: 0.3,
      fundBal3: 400,
      fundBalQmRatio3: 0.4,
      fundBal4: 500,
      fundBalQmRatio4: 0.5,
    });
  }, []);

  return (
    <PieChart
      style={{ height: 350 }}
      baseConfig={{
        HAS_TOOLTIP: true,
      }}
      data={chartData}
      chartConfig={configurations}
    />
  );
};

export default App;
