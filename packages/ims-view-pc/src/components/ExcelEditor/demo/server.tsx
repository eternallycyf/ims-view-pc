import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

/**
 * 配置了 exchangeEndpoint 时：上传 Nest → 默认 ExcelJS Worker（基础样式 + 分块）→ 前端合并后挂载。
 * 需先启动：pnpm start:server（默认 http://localhost:3010）
 */
const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        服务端异步解析：先 <code>pnpm start:server</code>，再配置{' '}
        <code>exchangeEndpoint</code>。默认 ExcelJS Worker（基础样式；约 10 万行 / 10s
        级），前端合并后一次挂载。
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
