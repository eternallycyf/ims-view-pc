import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        mode=&quot;all&quot;：筛选、排序、条件格式、数据验证、超链接、查找替换、备注、表格、图片等；评论默认关闭。
      </p>
      <div style={{ height: 'calc(100% - 32px)' }}>
        <ExcelEditor mode="all" viewMode="edit" />
      </div>
    </div>
  );
};

export default App;
