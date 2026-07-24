import { skeletonWorkbookFromMeta, type ChunkedBlock, type ChunkedWorkbookMeta } from './exceljsChunked';
import type { IWorkbookData } from './types';

/** meta + blocks → 整本 IWorkbookData（本地 Worker / 服务端拉块后共用） */
export const assembleWorkbookFromChunks = (
  meta: ChunkedWorkbookMeta,
  blocks: ChunkedBlock[],
): IWorkbookData => {
  const workbook = skeletonWorkbookFromMeta(meta) as IWorkbookData;
  const sheets = { ...(workbook.sheets || {}) };

  for (const block of blocks) {
    const sheet = sheets[block.sheetId];
    if (!sheet) continue;
    const cellData = { ...(sheet.cellData || {}) };
    Object.keys(block.cellData).forEach((rKey) => {
      const r = Number(rKey);
      cellData[r] = { ...(cellData[r] || {}), ...block.cellData[r] };
    });
    sheets[block.sheetId] = { ...sheet, cellData };
  }

  return { ...workbook, sheets };
};
