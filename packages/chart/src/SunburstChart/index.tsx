import { Empty } from 'antd';
import { Fragment } from 'react';
import Charts from '../BaseChart';
import { getOptions } from './chart';
import { SunburstChartConfig } from './interface';
import { BASE_CONFIG } from './utils';

const SunburstChart = (props: SunburstChartConfig) => {
  const { data, baseConfig = BASE_CONFIG, chartConfig = {}, style } = props;
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
          }}
        />
      ) : (
        <Charts option={getOptions({ data, baseConfig, chartConfig })} style={style} />
      )}
    </Fragment>
  );
};

export default SunburstChart;
