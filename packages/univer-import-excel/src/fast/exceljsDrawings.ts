/**
 * ExcelJS → Univer 浮动图 / 冻结窗格。
 * 图片写入 resources[SHEET_DRAWING_PLUGIN]，字段形态严格对齐
 * vendor LuckyToUniver/UniverWorkBook.handleImage（Lucky 路径已验证可用）。
 */
import type ExcelJS from 'exceljs';

/** EMU → px（与 LuckyExcel getPxByEMUs 一致：emu/9525） */
export const emuToPx = (emu?: number): number => {
  const n = Number(emu);
  if (!Number.isFinite(n) || n === 0) return 0;
  return Math.round(n / 9525);
};

export type SheetFreeze = {
  xSplit: number;
  ySplit: number;
  startRow: number;
  startColumn: number;
};

/** 冻结窗格（Excel「冻结首行/首列」；用户常称锁定行列） */
export const collectWorksheetFreeze = (
  worksheet: ExcelJS.Worksheet,
): SheetFreeze | undefined => {
  const views = (worksheet.views || []) as Array<{
    state?: string;
    xSplit?: number;
    ySplit?: number;
  }>;
  const frozen = views.find((v) => v.state === 'frozen' || v.state === 'frozenSplit');
  if (!frozen) return undefined;
  const xSplit = Math.max(0, Number(frozen.xSplit) || 0);
  const ySplit = Math.max(0, Number(frozen.ySplit) || 0);
  if (xSplit <= 0 && ySplit <= 0) return undefined;
  return {
    xSplit,
    ySplit,
    startColumn: xSplit,
    startRow: ySplit,
  };
};

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
};

const bufferToBase64 = (buf: Buffer | Uint8Array | ArrayBuffer): string => {
  if (typeof Buffer !== 'undefined') {
    if (Buffer.isBuffer(buf)) return buf.toString('base64');
    if (buf instanceof ArrayBuffer) return Buffer.from(buf).toString('base64');
    return Buffer.from(buf).toString('base64');
  }
  const bytes =
    buf instanceof ArrayBuffer
      ? new Uint8Array(buf)
      : buf instanceof Uint8Array
        ? buf
        : new Uint8Array(0);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const mediaToDataUrl = (media: {
  extension?: string;
  buffer?: Buffer | Uint8Array | ArrayBuffer;
  base64?: string;
}): string | null => {
  const ext = String(media.extension || 'png').toLowerCase().replace(/^\./, '');
  const mime = MIME_BY_EXT[ext];
  if (!mime) return null;
  if (media.base64) {
    const raw = String(media.base64);
    return raw.startsWith('data:') ? raw : `data:${mime};base64,${raw}`;
  }
  if (!media.buffer) return null;
  return `data:${mime};base64,${bufferToBase64(media.buffer)}`;
};

type AnchorLike = {
  nativeCol?: number;
  nativeColOff?: number;
  nativeRow?: number;
  nativeRowOff?: number;
};

type ImageExt = { width?: number; height?: number };

type ExcelJsImage = {
  type?: string;
  imageId: number | string;
  range?: {
    tl?: AnchorLike;
    br?: AnchorLike;
    ext?: ImageExt;
    editAs?: string;
  };
};

type SheetAnchor = {
  column: number;
  columnOffset: number;
  row: number;
  rowOffset: number;
};

const anchorPoint = (anchor: AnchorLike): SheetAnchor => ({
  column: Number(anchor.nativeCol) || 0,
  columnOffset: emuToPx(anchor.nativeColOff),
  row: Number(anchor.nativeRow) || 0,
  rowOffset: emuToPx(anchor.nativeRowOff),
});

const toAnchorLike = (value: unknown): AnchorLike | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as AnchorLike & { model?: AnchorLike };
  // ExcelJS Image.range.tl / br 可能是 Anchor 实例
  if (raw.model && (raw.model.nativeCol != null || raw.model.nativeRow != null)) {
    return raw.model;
  }
  if (raw.nativeCol != null || raw.nativeRow != null) return raw;
  return undefined;
};

/**
 * 解析 ExcelJS Image 的 from/to。
 * - twoCellAnchor：tl + br（与 Lucky 读 xdr:from / xdr:to 一致）
 * - oneCellAnchor：tl + ext（ExcelJS 已把 cx/cy 转成 px）；合成 to = fromOff + size
 *   （对齐 LuckySheet.getImageBaseInfo 无 xdr:to 时的分支）
 */
const resolveSheetAnchors = (
  range: ExcelJsImage['range'] | undefined,
): { from: SheetAnchor; to: SheetAnchor } | null => {
  const tl = toAnchorLike(range?.tl);
  if (!tl) return null;
  const from = anchorPoint(tl);
  const br = toAnchorLike(range?.br);

  if (br) {
    return { from, to: anchorPoint(br) };
  }

  // oneCellAnchor：ext.width/height 已是 px（ExcelJS ExtXform /9525）
  const widthPx = Math.max(0, Math.round(Number(range?.ext?.width) || 0));
  const heightPx = Math.max(0, Math.round(Number(range?.ext?.height) || 0));
  if (widthPx <= 0 && heightPx <= 0) return null;

  return {
    from,
    to: {
      column: from.column,
      columnOffset: from.columnOffset + widthPx,
      row: from.row,
      rowOffset: from.rowOffset + heightPx,
    },
  };
};

/**
 * 收集全簿浮动图 → SHEET_DRAWING_PLUGIN resource。
 * 输出结构刻意与 Lucky `handleImage` 一致：
 * - transform 宽高/scale 置 0，交给 Univer 按 sheetTransform + 列宽行高计算
 * - anchorType 固定 '1'（Both），与 Lucky 一致（不要用 Position，否则易按错误尺寸铺满）
 */
export const collectWorkbookDrawingResources = (
  workbook: ExcelJS.Workbook,
  sheetInfos: Array<{ worksheet: ExcelJS.Worksheet; sheetId: string }>,
  workbookId: string,
): Array<{ name: string; data: string }> | undefined => {
  const bySheet: Record<
    string,
    {
      data: Record<string, unknown>;
      order: string[];
    }
  > = {};
  let drawingCounter = 0;

  for (const { worksheet, sheetId } of sheetInfos) {
    const imagesRaw =
      typeof (worksheet as ExcelJS.Worksheet & { getImages?: () => unknown[] }).getImages ===
      'function'
        ? (worksheet as ExcelJS.Worksheet & { getImages: () => unknown[] }).getImages()
        : [];
    const images = imagesRaw as ExcelJsImage[];
    if (!images.length) continue;

    const data: Record<string, unknown> = {};
    const order: string[] = [];

    for (const im of images) {
      if (im.type && im.type !== 'image') continue;
      const range = im.range as ExcelJsImage['range'] | undefined;
      const anchors = resolveSheetAnchors(range);
      if (!anchors) continue;

      let media: { extension?: string; buffer?: Buffer | Uint8Array; base64?: string } | undefined;
      try {
        media = workbook.getImage(Number(im.imageId)) as unknown as typeof media;
      } catch {
        media = undefined;
      }
      if (!media) continue;
      const source = mediaToDataUrl(media);
      if (!source) continue;

      const drawingId = `drawing-${drawingCounter++}`;
      // 与 Lucky UniverWorkBook.handleImage 图片分支字段对齐
      data[drawingId] = {
        unitId: workbookId,
        subUnitId: sheetId,
        drawingId,
        transform: {
          width: 0,
          height: 0,
          scaleX: 0,
          scaleY: 0,
          left: 0,
          top: 0,
          angle: 0,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false,
        },
        sheetTransform: {
          angle: 0,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false,
          from: anchors.from,
          to: anchors.to,
        },
        drawingType: 0, // DrawingTypeEnum.DRAWING_IMAGE
        imageSourceType: 'BASE64',
        source,
        prstGeom: 'rect',
        anchorType: '1', // SheetDrawingAnchorType.Both —— Lucky 固定写 '1'
      };
      order.push(drawingId);
    }

    if (order.length) {
      bySheet[sheetId] = { data, order };
    }
  }

  if (!Object.keys(bySheet).length) return undefined;
  return [{ name: 'SHEET_DRAWING_PLUGIN', data: JSON.stringify(bySheet) }];
};
