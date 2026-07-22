import { ExportIcon, FolderIcon } from '@univerjs/icons';
import type { FUniver } from '@univerjs/presets';
import React from 'react';

/** 包一层普通组件，避免 Univer 以单参数调用 forwardRef 图标触发告警 */
const ImsExcelImportIcon = (props: Record<string, unknown>) =>
  React.createElement(FolderIcon, props as any);
const ImsExcelExportIcon = (props: Record<string, unknown>) =>
  React.createElement(ExportIcon, props as any);

/**
 * 在 Ribbon「其他」页签（RibbonOthersGroup / ribbon.others，与开始 / 数据 / 公式同级）
 * 注册导入导出菜单。页签文案可通过 locale 将 ui.ribbon.others 改名为「导入导出」。
 */
export const registerExchangeRibbonMenus = (
  univerAPI: FUniver,
  handlers: {
    onImport: () => void;
    onExport: () => void;
  },
) => {
  if (!univerAPI?.createMenu || !univerAPI?.registerComponent) {
    return;
  }

  univerAPI.registerComponent('ImsExcelImportIcon', ImsExcelImportIcon);
  univerAPI.registerComponent('ImsExcelExportIcon', ImsExcelExportIcon);

  // ribbon.others.others === RibbonOthersGroup.OTHERS
  univerAPI
    .createMenu({
      id: 'ims-excel-import',
      title: '导入',
      tooltip: '导入 Excel（支持 .xlsx / .xls）',
      icon: 'ImsExcelImportIcon',
      action: () => handlers.onImport(),
    })
    .appendTo('ribbon.others.others');

  univerAPI
    .createMenu({
      id: 'ims-excel-export',
      title: '导出',
      tooltip: '导出为 .xlsx',
      icon: 'ImsExcelExportIcon',
      action: () => handlers.onExport(),
    })
    .appendTo('ribbon.others.others');
};
