import { BaseChart } from '@ims-view/chart';
import React from 'react';

const barChartOption = {
  width: 500,
  title: {
    text: '柱形图示例',
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
      type: 'bar',
      data: [150, 230, 224, 218, 135, 147],
    },
  ],
};

const Demo2 = () => {
  return (
    <div style={{ width: '100%' }}>
      <h2>barChart 使用示例 - 柱形图</h2>
      <BaseChart option={barChartOption} />
    </div>
  );
};

export default Demo2;
