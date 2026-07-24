import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

/**
 * 配置了 exchangeEndpoint 时：上传 Nest → 服务端异步解析（小文件 LuckyExcel snapshot / 大文件 ExcelJS Worker 分块）→ 前端轮询并渐进挂载。
 * 需先启动：pnpm start:server（默认 http://localhost:3010）
 */
const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        服务端异步解析：先 <code>pnpm start:server</code>，再配置{' '}
        <code>exchangeEndpoint</code>。大文件仍用 LuckyExcel 解析，再分块渐进挂载（与本地导入同一套解析）。
      </p>
      <div style={{ height: 'calc(100% - 32px)' }}>
        <ExcelEditor
          mode="simple"
          viewMode="edit"
          exchangeEndpoint="http://localhost:3010"
        />
      </div>
    </div>
  );
};

export default App;
