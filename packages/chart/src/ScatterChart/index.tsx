import { Empty } from 'antd';
import { Fragment } from 'react';
import Charts from '../BaseChart';
import { getOptions } from './chart';
import { IScatterChartProps } from './interface';
import { BASE_CONFIG } from './utils';

const StackChart = (props: IScatterChartProps) => {
  const { data, baseConfig = BASE_CONFIG, chartConfig = [], style } = props;
  const isEmpty = !data || data.length === 0;
  return (
    <Fragment>
      {isEmpty ? (
        <Empty
          style={{
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
          }}
        />
      ) : (
        <Charts style={style} option={getOptions({ data, baseConfig, chartConfig })} />
      )}
    </Fragment>
  );
};

export default StackChart;
