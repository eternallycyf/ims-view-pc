import { UniverSheetsConditionalFormattingPreset } from '@univerjs/preset-sheets-conditional-formatting';
import UniverPresetSheetsConditionalFormattingZhCN from '@univerjs/preset-sheets-conditional-formatting/lib/locales/zh-CN';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverPresetSheetsCoreZhCN from '@univerjs/preset-sheets-core/lib/locales/zh-CN';
import { UniverSheetsDataValidationPreset } from '@univerjs/preset-sheets-data-validation';
import UniverPresetSheetsDataValidationZhCN from '@univerjs/preset-sheets-data-validation/lib/locales/zh-CN';
import { UniverSheetsDrawingPreset } from '@univerjs/preset-sheets-drawing';
import UniverPresetSheetsDrawingZhCN from '@univerjs/preset-sheets-drawing/lib/locales/zh-CN';
import { UniverSheetsFilterPreset } from '@univerjs/preset-sheets-filter';
import UniverPresetSheetsFilterZhCN from '@univerjs/preset-sheets-filter/lib/locales/zh-CN';
import { UniverSheetsFindReplacePreset } from '@univerjs/preset-sheets-find-replace';
import UniverPresetSheetsFindReplaceZhCN from '@univerjs/preset-sheets-find-replace/lib/locales/zh-CN';
import { UniverSheetsHyperLinkPreset } from '@univerjs/preset-sheets-hyper-link';
import UniverPresetSheetsHyperLinkZhCN from '@univerjs/preset-sheets-hyper-link/lib/locales/zh-CN';
import { UniverSheetsNotePreset } from '@univerjs/preset-sheets-note';
import UniverPresetSheetsNoteZhCN from '@univerjs/preset-sheets-note/lib/locales/zh-CN';
import { UniverSheetsSortPreset } from '@univerjs/preset-sheets-sort';
import UniverPresetSheetsSortZhCN from '@univerjs/preset-sheets-sort/lib/locales/zh-CN';
import { UniverSheetsTablePreset } from '@univerjs/preset-sheets-table';
import UniverPresetSheetsTableZhCN from '@univerjs/preset-sheets-table/lib/locales/zh-CN';
import { UniverSheetsThreadCommentPreset } from '@univerjs/preset-sheets-thread-comment';
import UniverPresetSheetsThreadCommentZhCN from '@univerjs/preset-sheets-thread-comment/lib/locales/zh-CN';
import type { ExcelEditorFeatureMode, ExcelEditorFeatures, ExcelEditorViewMode } from '../interface';

import '@univerjs/preset-sheets-core/lib/index.css';
import '@univerjs/preset-sheets-drawing/lib/index.css';
import '@univerjs/preset-sheets-filter/lib/index.css';
import '@univerjs/preset-sheets-sort/lib/index.css';
import '@univerjs/preset-sheets-conditional-formatting/lib/index.css';
import '@univerjs/preset-sheets-data-validation/lib/index.css';
import '@univerjs/preset-sheets-hyper-link/lib/index.css';
import '@univerjs/preset-sheets-find-replace/lib/index.css';
import '@univerjs/preset-sheets-note/lib/index.css';
import '@univerjs/preset-sheets-table/lib/index.css';
import '@univerjs/preset-sheets-thread-comment/lib/index.css';

/** 开源能力全集（不含商业能力；评论默认关闭） */
export const ALL_OPEN_FEATURES: Required<ExcelEditorFeatures> = {
  drawing: true,
  filter: true,
  sort: true,
  conditionalFormatting: true,
  dataValidation: true,
  hyperLink: true,
  findReplace: true,
  note: true,
  table: true,
  threadComment: false,
};

export const resolveFeatures = (
  mode: ExcelEditorFeatureMode,
  features?: ExcelEditorFeatures,
): Required<ExcelEditorFeatures> => {
  if (mode === 'all') {
    return { ...ALL_OPEN_FEATURES, threadComment: Boolean(features?.threadComment) };
  }

  if (mode === 'custom') {
    return {
      drawing: Boolean(features?.drawing),
      filter: Boolean(features?.filter),
      sort: Boolean(features?.sort),
      conditionalFormatting: Boolean(features?.conditionalFormatting),
      dataValidation: Boolean(features?.dataValidation),
      hyperLink: Boolean(features?.hyperLink),
      findReplace: Boolean(features?.findReplace),
      note: Boolean(features?.note),
      table: Boolean(features?.table),
      threadComment: Boolean(features?.threadComment),
    };
  }

  // simple：核心编辑 + 插入（图片/超链接），不含公式栏相关数据能力与评论
  return {
    drawing: true,
    filter: false,
    sort: false,
    conditionalFormatting: false,
    dataValidation: false,
    hyperLink: true,
    findReplace: false,
    note: false,
    table: false,
    threadComment: false,
  };
};

export type BuildUniverPresetsOptions = {
  container: HTMLElement;
  viewMode: ExcelEditorViewMode;
  mode: ExcelEditorFeatureMode;
  features?: ExcelEditorFeatures;
};

export type BuiltUniverPresets = {
  presets: Array<ReturnType<typeof UniverSheetsCorePreset>>;
  locales: object[];
  resolvedFeatures: Required<ExcelEditorFeatures>;
};

export const buildUniverPresets = (options: BuildUniverPresetsOptions): BuiltUniverPresets => {
  const { container, viewMode, mode, features } = options;
  const resolved = resolveFeatures(mode, features);
  const isPreview = viewMode === 'preview';

  const isSimple = mode === 'simple';

  const presets: Array<ReturnType<typeof UniverSheetsCorePreset>> = [
    UniverSheetsCorePreset({
      container,
      toolbar: !isPreview,
      contextMenu: !isPreview,
      // 简单模式不展示公式栏
      formulaBar: !isPreview && !isSimple,
      footer: !isPreview,
      // 导入数据常把数字存成文本；关闭绿三角提示，避免露出未翻译 key
      sheets: {
        disableForceStringAlert: true,
        disableForceStringMark: true,
      },
    }),
  ];

  const locales: object[] = [UniverPresetSheetsCoreZhCN];

  if (resolved.drawing) {
    presets.push(UniverSheetsDrawingPreset());
    locales.push(UniverPresetSheetsDrawingZhCN);
  }
  if (resolved.filter) {
    presets.push(UniverSheetsFilterPreset());
    locales.push(UniverPresetSheetsFilterZhCN);
  }
  if (resolved.sort) {
    presets.push(UniverSheetsSortPreset());
    locales.push(UniverPresetSheetsSortZhCN);
  }
  if (resolved.conditionalFormatting) {
    presets.push(UniverSheetsConditionalFormattingPreset());
    locales.push(UniverPresetSheetsConditionalFormattingZhCN);
  }
  if (resolved.dataValidation) {
    presets.push(UniverSheetsDataValidationPreset());
    locales.push(UniverPresetSheetsDataValidationZhCN);
  }
  if (resolved.hyperLink) {
    presets.push(UniverSheetsHyperLinkPreset());
    locales.push(UniverPresetSheetsHyperLinkZhCN);
  }
  if (resolved.findReplace) {
    presets.push(UniverSheetsFindReplacePreset());
    locales.push(UniverPresetSheetsFindReplaceZhCN);
  }
  if (resolved.note) {
    presets.push(UniverSheetsNotePreset());
    locales.push(UniverPresetSheetsNoteZhCN);
  }
  if (resolved.table) {
    presets.push(UniverSheetsTablePreset());
    locales.push(UniverPresetSheetsTableZhCN);
  }
  if (resolved.threadComment) {
    presets.push(UniverSheetsThreadCommentPreset());
    locales.push(UniverPresetSheetsThreadCommentZhCN);
  }

  return { presets, locales, resolvedFeatures: resolved };
};
