import { Empty } from 'antd';
import { Fragment } from 'react';
import Chart from '../BaseChart';
import { getOptions } from './chart';
import { IPieChartProps } from './interface';
import { BASE_CONFIG } from './utils';

const PieChart = (props: IPieChartProps) => {
  const { data, baseConfig = BASE_CONFIG, chartConfig = [], style, emptyStyle } = props;
  const isEmpty = !data || data.length === 0;
  return (
    <Fragment>
      {isEmpty ? (
        <Empty
          style={{
            height: style?.height ?? 300,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            ...emptyStyle,
          }}
        />
      ) : (
        <Chart option={getOptions({ data, baseConfig, chartConfig })} style={style} />
      )}
    </Fragment>
  );
};

export default PieChart;
