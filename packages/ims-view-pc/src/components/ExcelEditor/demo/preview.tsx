import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%' }}>
      <ExcelEditor mode="simple" viewMode="preview" height={480} />
    </div>
  );
};

export default App;
