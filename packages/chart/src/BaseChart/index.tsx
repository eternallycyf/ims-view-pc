import ReactECharts from 'echarts-for-react';
import type { EChartsReactProps } from 'echarts-for-react/lib/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';

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
    const echartsInstance = ref?.current?.getEchartsInstance();

    if (echartsInstance) {
      const handleResize = () => echartsInstance.resize();
      setOption(defaultOptions);

      echartsInstance.setOption(defaultOptions, true);
      setTimeout(handleResize, 0);

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [defaultOptions, ref]);

  return <ReactECharts className="base-chart" ref={ref} option={option} {...restProps} />;
};

export default forwardRef(ReactEChart);
