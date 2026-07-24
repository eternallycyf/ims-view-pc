import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        本地导入导出（.xlsx / .csv）。导入 / 导出均走 Web Worker，避免主线程卡死。导入超过约
        512KB 自动分块；导出默认 Worker 内 LuckyExcel→xlsx（与 Nest 同一套）。不配{' '}
        <code>exchangeEndpoint</code>。服务端大表请看「服务端导入」。
      </p>
      <div style={{ height: 'calc(100% - 32px)' }}>
        <ExcelEditor mode="simple" viewMode="edit" />
      </div>
    </div>
  );
};

export default App;
