import { SunburstChart } from '@ims-view/chart';

const chartData = {
  rg: 166,
  rgPercent: 0.2,
  rgzd: 25,
  rgzdPercent: 0.2,
  rghx: 65,
  rghxPercent: 0.2,
  rgqt: 76,
  rgqtPercent: 0.1,
  mr: 115,
  mrPercent: 0.2,
  mrzd: 25,
  mrzdPercent: 0.2,
  mrhx: 27,
  mrhxPercent: 0.2,
  mrqt: 63,
  mrqtPercent: 0.1,
  sg: 166,
  sgPercent: 0.2,
  sgzd: 25,
  sgzdPercent: 0.2,
  sghx: 65,
  sghxPercent: 0.2,
  sgqt: 76,
  sgqtPercent: 0.1,
};

const App = () => {
  return (
    <SunburstChart
      data={chartData}
      baseConfig={{}}
      chartConfig={[
        {
          fieldNames: {
            name: '认购',
            valueKey: 'rg',
            percentKey: 'rgPercent',
            color: '#FB8B36',
            children: [
              {
                name: '核心',
                valueKey: 'rghx',
                percentKey: 'rghxPercent',
                color: '#FEDEBB',
              },
              {
                name: '重点',
                valueKey: 'rgzd',
                percentKey: 'rgzdPercent',
                color: '#FCC58E',
              },
              {
                name: '其他',
                valueKey: 'rgqt',
                percentKey: 'rgqtPercent',
                color: '#FBAA62',
              },
            ],
          },
          unitSymbol: '%',
        },
        {
          fieldNames: {
            name: '申购',
            valueKey: 'sg',
            percentKey: 'sgPercent',
            color: '#55CEDA',
            children: [
              {
                name: '核心',
                valueKey: 'sghx',
                percentKey: 'sghxPercent',
                color: '#BFF6F5',
              },
              {
                name: '重点',
                valueKey: 'sgzd',
                percentKey: 'sgzdPercent',
                color: '#98EBED',
              },
              {
                name: '其他',
                valueKey: 'sgqt',
                percentKey: 'sgqtPercent',
                color: '#74DEE3',
              },
            ],
          },
          unitSymbol: '%',
        },
        {
          fieldNames: {
            name: '买入',
            valueKey: 'mr',
            percentKey: 'mrPercent',
            color: '#4D7FE3',
            children: [
              {
                name: '核心',
                valueKey: 'mrhx',
                percentKey: 'mrhxPercent',
                color: '#BED7F8',
              },
              {
                name: '重点',
                valueKey: 'mrzd',
                percentKey: 'mrzdPercent',
                color: '#96BBF1',
              },
              {
                name: '其他',
                valueKey: 'mrqt',
                percentKey: 'mrqtPercent',
                color: '#719DEA',
              },
            ],
          },
          unitSymbol: '%',
        },
      ]}
    />
  );
};

export default App;
