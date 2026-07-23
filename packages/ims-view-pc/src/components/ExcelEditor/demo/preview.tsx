import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <ExcelEditor mode="simple" viewMode="preview" />
    </div>
  );
};

export default App;
