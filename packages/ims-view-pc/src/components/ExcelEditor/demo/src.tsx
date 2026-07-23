import { ExcelEditor } from 'ims-view-pc';
import React from 'react';

const isProd = process.env.NODE_ENV === 'production';

/** 开发态跟随当前文档站 origin + publicPath，避免写死 localhost:8000 */
const getDemoExcelUrl = () => {
  if (isProd) {
    return 'https://ims-view-pc-eternallycyfs-projects.vercel.app/excel.xlsx';
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/ims-view-pc/excel.xlsx`;
  }
  return '/ims-view-pc/excel.xlsx';
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <ExcelEditor src={getDemoExcelUrl()} mode="simple" viewMode="preview" />
    </div>
  );
};

export default App;
