import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

/**
 * 大文件（建议 ≥1MB）走 Nest 服务端导入导出。
 * 需先启动：pnpm start:server（默认 http://localhost:3010）
 */
const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        大文件（≥1MB）请使用服务端导入：先执行 <code>pnpm start:server</code>，再配置{' '}
        <code>exchangeEndpoint</code>。未配置时默认走前端本地导入。
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
