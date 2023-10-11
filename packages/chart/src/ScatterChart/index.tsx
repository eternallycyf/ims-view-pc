import { Empty } from 'antd';
import { Fragment } from 'react';
import Charts from '../BaseChart';
import { getOptions } from './chart';
import { IGetScatterChartOptions } from './interface';
import { BASE_CONFIG } from './utils';

const StackChart = (props: IGetScatterChartOptions) => {
  const { data, baseConfig = BASE_CONFIG, chartConfig = {} } = props;
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
        <Charts option={getOptions({ data, baseConfig, chartConfig })} />
      )}
    </Fragment>
  );
};

export default StackChart;
