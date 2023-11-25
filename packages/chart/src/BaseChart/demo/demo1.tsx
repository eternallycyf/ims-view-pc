import { BaseChart } from '@ims-view/chart';
import React from 'react';

const lineChartOption = {
  width: 500,
  title: {
    text: '折线图示例',
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '销量',
      type: 'line',
      data: [150, 230, 224, 218, 135, 147],
    },
  ],
};

const Demo1 = () => {
  return (
    <div style={{ width: '100%' }}>
      <h2>lineChart 使用示例 - 折线图</h2>
      <BaseChart style={{ height: 300, width: '100%' }} option={lineChartOption} />
    </div>
  );
};

export default Demo1;
