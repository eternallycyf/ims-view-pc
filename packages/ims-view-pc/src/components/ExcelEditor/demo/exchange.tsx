import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%' }}>
      <p style={{ marginBottom: 8, color: '#666' }}>
        编辑视图默认带「导入导出」页签；简单模式同样可用。支持 .xlsx / .xls。
      </p>
      <ExcelEditor mode="simple" viewMode="edit" height={520} />
    </div>
  );
};

export default App;
