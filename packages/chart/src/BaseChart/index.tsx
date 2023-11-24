import ReactECharts from 'echarts-for-react';
import type { EChartsReactProps } from 'echarts-for-react/lib/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface IHandle {
  ref: echarts.ECharts;
}

const ReactEChart: React.ForwardRefRenderFunction<IHandle, EChartsReactProps> = (
  props,
  echartsRef,
) => {
  const { option: defaultOptions, ...restProps } = props;
  const [option, setOption] = React.useState<EChartsReactProps['option']>(defaultOptions);
  const ref = useRef<InstanceType<typeof ReactECharts>>(null!);

  useImperativeHandle(echartsRef, () => ({
    ref: ref.current.getEchartsInstance(),
  }));

  useEffect(() => {
    setOption(defaultOptions);
  }, []);

  return (
    <div>
      <ReactECharts ref={ref} option={option} {...restProps} />
    </div>
  );
};

export default forwardRef(ReactEChart);
