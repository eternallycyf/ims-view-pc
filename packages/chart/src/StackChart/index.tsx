import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';
import { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { getOptions } from './chart';
import { IGetStackOptions } from './interface';
import { BASE_CONFIG } from './utils';

const StackChart = (props: IGetStackOptions) => {
  const [options, setOptions] = useState({});
  const [currentSelectedLegend, setCurrentSelectedLegend] = useState<string[]>([]);
  const EchartsRef = useRef<any>(null);

  const { data, baseConfig: newBaseConfig, chartConfig = {}, style } = props;
  const baseConfig = { ...BASE_CONFIG, ...newBaseConfig };
  const HAS_TOP_LABEL = baseConfig.HAS_TOP_LABEL;
  const TOTAL_NAME = baseConfig.TOTAL_NAME;
  const TIME = baseConfig.TIME;

  const isEmpty = !data || data.length === 0;

  useLayoutEffect(() => {
    const options = getOptions({
      data,
      baseConfig,
      chartConfig,
    });
    setOptions(options);
    if (EchartsRef?.current?.getEchartsInstance()) {
      EchartsRef?.current?.getEchartsInstance()?.setOption(options, true);
    }
  }, [data]);

  const hanleChangeLegend = useCallback(
    (obj: any) => {
      const selectedKeys = obj?.selected
        ? Object.entries(obj?.selected)
            .filter(([key, val]) => val)
            .map((item) => item?.[0])
        : [];
      setCurrentSelectedLegend(selectedKeys);
      const options = getOptions({
        data,
        baseConfig,
        chartConfig,
      });
      setOptions(options);

      if (!HAS_TOP_LABEL) return;
      const { selected } = obj;
      const barList = chartConfig.filter((item: any) => item.type === 'bar');
      const currentList = Object.entries(selected)
        .filter(([key, val]) => val)
        .map((item) => item?.[0])
        .filter(Boolean);

      const currentBarList = _.intersection(
        barList?.map((item: any) => item.name),
        currentList,
      ).filter(Boolean);

      const topKey = chartConfig.find((item: any) => item.name === TOTAL_NAME)?.dataKey;
      const otherKeyList = currentBarList.map(
        (item) => chartConfig?.find((ele: any) => ele?.name == item)?.dataKey,
      );

      const newData = ([...data] || []).map((item: any) => {
        let total = 0;
        otherKeyList.forEach((ele) => {
          total = total + (Number(item?.[ele]) || 0);
        });
        return { ...item, [topKey]: total ? (+total?.toFixed(2)).toLocaleString() : 0 };
      });

      let newOptions = _.cloneDeep(
        getOptions({
          data: newData,
          baseConfig,
          chartConfig,
        }),
      );

      const index = newOptions?.series?.findIndex((item: any) => item.isTopFlag);

      if (newOptions?.series?.[index]?.series) {
        // @ts-ignore
        newOptions.series[index].series.label.formatter = (item) => {
          const newObj = newData.find((ele: any) => ele[TIME] === item?.data?.[TIME]);
          return newObj?.[topKey] || '';
        };
        setOptions(newOptions);
        EchartsRef?.current?.getEchartsInstance()?.setOption(newOptions);
      }
    },
    [data],
  );

  const onEvents = {
    legendselectchanged: hanleChangeLegend,
  };

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
        <ReactECharts option={options} style={style} onEvents={onEvents} ref={EchartsRef} />
      )}
    </Fragment>
  );
};

export default StackChart;
