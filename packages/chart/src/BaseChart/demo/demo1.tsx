import { BaseChart } from '@ims-view/chart';
import React from 'react';

const lineChartOption = {
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
    <div>
      <h2>lineChart 使用示例 - 折线图</h2>
      <BaseChart option={lineChartOption} />
    </div>
  );
};

export default Demo1;
