import { PieChart, ScatterChart } from '@ims-view/chart';
import { useEffect, useState } from 'react';

const App = () => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    setChartData([
      { name: 'FundCompany1', pay: -100, noPay: 0 },
      { name: 'FundCompany2', pay: -50, noPay: 0 },
      { name: 'FundCompany3', pay: -500, noPay: 0.1 },
      { name: 'FundCompany4', pay: -200, noPay: 0 },
      { name: 'FundCompany5', pay: -800, noPay: 2 },
      { name: 'FundCompany6', pay: -1500, noPay: 9 },
      { name: 'FundCompany7', pay: -250, noPay: 1.2 },
      { name: 'FundCompany8', pay: 0, noPay: 10.5 },
      { name: 'FundCompany9', pay: -30, noPay: 4 },
      { name: 'FundCompany10', pay: -120, noPay: 0 },
      { name: 'FundCompany11', pay: -1, noPay: 0.1 },
      { name: 'FundCompany12', pay: -600, noPay: 0 },
      { name: 'FundCompany14', pay: -10, noPay: 0.1 },
      { name: 'FundCompany15', pay: -1300, noPay: 8.9 },
      { name: 'FundCompany16', pay: -1300, noPay: 40.8 },
      { name: 'FundCompany17', pay: 0, noPay: 0 },
      { name: 'FundCompany18', pay: -350, noPay: 0 },
      { name: 'FundCompany19', pay: 0, noPay: 0.2 },
      { name: 'FundCompany20', pay: 0, noPay: 14.8 },
      { name: 'FundCompany21', pay: -0.1, noPay: 0 },
      { name: 'FundCompany22', pay: -950, noPay: 26.3 },
      { name: 'FundCompany23', pay: 0, noPay: 0 },
      { name: 'FundCompany24', pay: -1800, noPay: 0 },
      { name: 'FundCompany25', pay: -190, noPay: 1.4 },
      { name: 'FundCompany26', pay: -180, noPay: 5.4 },
    ]);
  }, []);

  return (
    <ScatterChart
      style={{ height: 350 }}
      baseConfig={{
        GRID_CONFIG: {
          left: '1.5%',
          right: '7%',
          bottom: '15%',
          top: '5%',
        },
      }}
      data={chartData}
      chartConfig={[
        {
          name: 'pay',
          dataKey: 'pay',
          isLegend: false,
          isSeries: true,
          unitSymbol: '万',
          shape: false,
          type: 'scatter',
          shapeColor: 'rgba(2,119,249,0.2)',
          formatColor: () => '#2A303B',
        },
        {
          name: 'noPay',
          dataKey: 'noPay',
          isLegend: false,
          isSeries: false,
          unitSymbol: '万',
          shape: false,
          type: 'scatter',
          shapeColor: 'rgba(2,119,249,0.2)',
          formatColor: () => '#2A303B',
        },
      ]}
    />
  );
};

export default App;
