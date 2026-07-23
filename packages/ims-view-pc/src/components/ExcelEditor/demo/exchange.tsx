import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        默认前端本地导入导出（支持 .xlsx / .xls）。大文件请看「服务端导入」示例。
      </p>
      <div style={{ height: 'calc(100% - 32px)' }}>
        <ExcelEditor mode="simple" viewMode="edit" />
      </div>
    </div>
  );
};

export default App;
