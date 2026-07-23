import {
  createUniver,
  LocaleType,
  LogLevel,
  mergeLocales,
  type FUniver,
  type IWorkbookData,
  type Univer,
} from '@univerjs/presets';
import { Spin, message, theme as antdTheme } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import './index.less';
import type {
  ExcelEditorFeatureMode,
  ExcelEditorHandle,
  ExcelEditorProps,
  ExcelEditorViewMode,
} from './interface';
import { buildUniverPresets } from './utils/buildUniverPresets';
import {
  buildThemeCssVars,
  buildUniverTheme,
  pickThemeColorsFromToken,
} from './utils/buildUniverTheme';
import { DEFAULT_WORKBOOK_DATA } from './utils/defaultWorkbookData';
import {
  applyImportedImages,
  exportWorkbook,
  importWorkbook,
} from './utils/exchangeApi';
import type { ExcelImportResult } from './utils/excelToWorkbookData';
import { loadImportResultFromUrl } from './utils/excelToWorkbookData';
import { registerExchangeRibbonMenus } from './utils/registerExchangeMenus';

/**
 * mergeLocales 内部是 Object.assign 浅合并。
 * 不能直接 merge `{ ui: { ribbon: { others } } }`，否则会覆盖整个 ui 语言包，
 * 导致界面出现 ui.ribbon.start / ui.shortcut.undo 等 key。
 */
const patchRibbonExchangeLocale = (locales: Record<string, any>) => {
  const next = { ...locales };
  const ui = { ...(next.ui || {}) };
  const ribbon = { ...(ui.ribbon || {}) };
  ribbon.others = '导入导出';
  ribbon.othersDesc = '导入和导出 Excel 文件';
  ui.ribbon = ribbon;
  next.ui = ui;
  return next;
};

const getWorkbookSnapshot = (workbook: ReturnType<FUniver['getActiveWorkbook']>) => {
  if (!workbook) return null;
  // Facade: getSnapshot / save 等价，优先 getSnapshot（univer-integrate 文档口径）
  return workbook.getSnapshot?.() ?? workbook.save?.() ?? null;
};

/**
 * 预览用 Univer 自带只读能力：
 * - fWorkbook.setEditable(false)
 * - getWorkbookPermission().setReadOnly()（viewer）
 * 再按需放开表头列宽 / 行高权限点。
 * https://docs.univer.ai/guides/sheets/features/core/permission
 * https://reference.univer.ai/en-US/classes/FWorkbook#seteditable
 */
const applyViewMode = async (univerAPI: FUniver, viewMode: ExcelEditorViewMode) => {
  const fWorkbook = univerAPI.getActiveWorkbook();

  if (!fWorkbook) {
    return;
  }

  const permission = fWorkbook.getWorkbookPermission?.();
  permission?.setPermissionDialogVisible?.(false);

  if (viewMode === 'preview') {
    // 官方 workbook 只读（禁止单元格编辑，含空单元格）
    fWorkbook.setEditable?.(false);
    await permission?.setReadOnly?.();

    const point = univerAPI.Enum?.WorksheetPermissionPoint;
    const sheets =
      (typeof fWorkbook.getSheets === 'function' ? fWorkbook.getSheets() : null) ||
      [fWorkbook.getActiveSheet()].filter(Boolean);

    for (const sheet of sheets) {
      const sheetPermission = sheet?.getWorksheetPermission?.();
      if (!sheetPermission) continue;

      // 官方 worksheet 只读
      if (typeof sheetPermission.setReadOnly === 'function') {
        await sheetPermission.setReadOnly();
      } else if (typeof sheetPermission.setMode === 'function') {
        await sheetPermission.setMode('readOnly');
      }

      // 只读基础上放开表头拖拽（列宽 / 行高）
      if (point && typeof sheetPermission.setPoint === 'function') {
        await sheetPermission.setPoint(point.SetColumnStyle, true);
        await sheetPermission.setPoint(point.SetRowStyle, true);
      }
    }

    // 保留选择，表头拖拽依赖 selection
    fWorkbook.enableSelection?.();
    return;
  }

  fWorkbook.setEditable?.(true);
  fWorkbook.enableSelection?.();
  await permission?.setEditable?.();
};

/** 简单模式隐藏「数据 / 公式」Ribbon 页签（DOM 文案匹配，兼容未带 title 的实现） */
const hideSimpleRibbonTabs = (root: HTMLElement | null) => {
  if (!root) return;
  const hideLabels = new Set(['数据', '公式', 'Data', 'Formulas', '公式审核']);
  root.querySelectorAll('[role="tab"]').forEach((node) => {
    const el = node as HTMLElement;
    const label = (el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent || '')
      .trim()
      .replace(/\s+/g, '');
    if (hideLabels.has(label)) {
      el.style.display = 'none';
    }
  });
};

const normalizeWorkbookData = (data: Partial<IWorkbookData>): Partial<IWorkbookData> => ({
  ...data,
  id: data.id || `wb-${Date.now()}`,
  appVersion: (data as { appVersion?: string }).appVersion || '0.25.1',
  locale: data.locale || 'zhCN',
});

/** 导出文件名统一为 .xlsx */
const toExportFileName = (name?: string) => {
  const raw = (name || 'workbook').trim() || 'workbook';
  const base = raw.replace(/\.(xlsx|xls)$/i, '') || 'workbook';
  return `${base}.xlsx`;
};

/** 从 src / 本地路径取文件名 */
const fileNameFromSrc = (src?: string) => {
  if (!src) return undefined;
  try {
    const path = src.split('?')[0];
    const name = decodeURIComponent(path.split('/').pop() || '');
    return name || undefined;
  } catch {
    return undefined;
  }
};

const resolveImportResult = async (
  data?: Partial<IWorkbookData>,
  src?: string,
): Promise<ExcelImportResult> => {
  if (data) {
    return { workbookData: normalizeWorkbookData(data), images: [] };
  }

  if (src) {
    const result = await loadImportResultFromUrl(src);
    return {
      ...result,
      workbookData: normalizeWorkbookData(result.workbookData),
    };
  }

  return { workbookData: normalizeWorkbookData(DEFAULT_WORKBOOK_DATA), images: [] };
};

const InternalExcelEditor: React.ForwardRefRenderFunction<ExcelEditorHandle, ExcelEditorProps> = (
  props,
  ref,
) => {
  const {
    prefixCls = 'excel-editor',
    className,
    style,
    height,
    width,
    mode = 'simple',
    features,
    viewMode = 'edit',
    src,
    data,
    exchangeEndpoint,
    showExchange,
    onReady,
    onError,
  } = props;

  const resolvedShowExchange = showExchange ?? viewMode === 'edit';
  // 稳定 features 依赖，避免父组件每次渲染传入新对象导致 Univer 反复销毁重建
  const featuresKey = JSON.stringify(features || {});

  const { token } = antdTheme.useToken();
  const themeColors = useMemo(
    () =>
      pickThemeColorsFromToken({
        colorPrimary: token.colorPrimary,
        colorPrimaryHover: token.colorPrimaryHover,
        colorPrimaryActive: token.colorPrimaryActive,
        colorPrimaryBg: token.colorPrimaryBg,
      }),
    [
      token.colorPrimary,
      token.colorPrimaryActive,
      token.colorPrimaryBg,
      token.colorPrimaryHover,
    ],
  );
  const univerTheme = useMemo(() => buildUniverTheme(themeColors), [themeColors]);
  const themeCssVars = useMemo(() => buildThemeCssVars(themeColors), [themeColors]);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const univerRef = useRef<Univer | null>(null);
  const univerAPIRef = useRef<FUniver | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const exchangeEndpointRef = useRef(exchangeEndpoint);
  const importXlsxRef = useRef<(file: File) => Promise<Partial<IWorkbookData>>>(async () => ({}));
  const exportXlsxRef = useRef<(fileName?: string) => Promise<void>>(async () => undefined);
  const enableDrawingRef = useRef(false);
  /** 默认导出文件名：与最近一次上传 / src 加载的文件名保持一致 */
  const fileNameRef = useRef(
    toExportFileName(fileNameFromSrc(src) || (data as { name?: string } | undefined)?.name),
  );
  const [loading, setLoading] = useState(true);
  const [exchanging, setExchanging] = useState(false);

  onReadyRef.current = onReady;
  onErrorRef.current = onError;
  exchangeEndpointRef.current = exchangeEndpoint;

  const replaceWorkbook = async (importResult: ExcelImportResult) => {
    const univerAPI = univerAPIRef.current;
    if (!univerAPI) {
      throw new Error('ExcelEditor 尚未初始化完成');
    }

    // 与可用 excel demo 一致：每次导入分配新 id，避免旧 unit 冲突导致空白
    const workbookData = normalizeWorkbookData(importResult.workbookData);

    const active = univerAPI.getActiveWorkbook();
    if (active) {
      univerAPI.disposeUnit(active.getId());
    }

    univerAPI.createWorkbook(workbookData);
    await applyViewMode(univerAPI, viewMode);
    if (enableDrawingRef.current) {
      await applyImportedImages(univerAPI, importResult.images);
    }
  };

  const importXlsx = async (file: File) => {
    setExchanging(true);
    try {
      const { result, meta } = await importWorkbook(file, {
        endpoint: exchangeEndpointRef.current,
      });
      fileNameRef.current = toExportFileName(file.name);
      await replaceWorkbook(result);
      message.success(meta.via === 'server' ? '导入成功（服务端）' : '导入成功（本地）');
      return result.workbookData;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onErrorRef.current?.(err);
      message.error(err.message || '导入失败');
      throw err;
    } finally {
      setExchanging(false);
    }
  };

  const exportXlsx = async (fileName?: string) => {
    const snapshot = getWorkbookSnapshot(univerAPIRef.current?.getActiveWorkbook() ?? null);

    if (!snapshot) {
      const err = new Error('当前没有可导出的工作簿');
      onErrorRef.current?.(err);
      message.error(err.message);
      throw err;
    }

    const exportName = toExportFileName(fileName || fileNameRef.current);

    setExchanging(true);
    try {
      const meta = await exportWorkbook(snapshot, exportName, {
        endpoint: exchangeEndpointRef.current,
      });
      message.success(meta.via === 'server' ? '导出成功（服务端）' : '导出成功（本地）');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onErrorRef.current?.(err);
      message.error(err.message || '导出失败');
      throw err;
    } finally {
      setExchanging(false);
    }
  };

  importXlsxRef.current = importXlsx;
  exportXlsxRef.current = exportXlsx;

  useImperativeHandle(ref, () => ({
    getUniverAPI: () => univerAPIRef.current,
    getWorkbookData: () => getWorkbookSnapshot(univerAPIRef.current?.getActiveWorkbook() ?? null),
    importXlsx,
    exportXlsx,
  }));

  useEffect(() => {
    let disposed = false;
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const isPreview = viewMode === 'preview';
    const { presets, locales, resolvedFeatures } = buildUniverPresets({
      container,
      viewMode,
      mode: mode as ExcelEditorFeatureMode,
      features,
    });
    enableDrawingRef.current = resolvedFeatures.drawing;

    // Preset 模式：createUniver 返回 { univer, univerAPI }，卸载时必须 dispose univer 本体
    const { univer, univerAPI } = createUniver({
      theme: univerTheme,
      locale: LocaleType.ZH_CN,
      logLevel: LogLevel.WARN,
      locales: {
        [LocaleType.ZH_CN]: patchRibbonExchangeLocale(mergeLocales(...locales)),
      },
      presets,
    });

    univerRef.current = univer;
    univerAPIRef.current = univerAPI;

    if (!isPreview && resolvedShowExchange) {
      registerExchangeRibbonMenus(univerAPI, {
        onImport: () => fileInputRef.current?.click(),
        onExport: () => {
          exportXlsxRef.current();
        },
      });
    }

    const lifecycleDisposable = univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, ({ stage }) => {
      if (stage === univerAPI.Enum.LifecycleStages.Rendered) {
        if (mode === 'simple') {
          hideSimpleRibbonTabs(container);
        }
        applyViewMode(univerAPI, viewMode).catch((error) => {
          onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
        });
      }
    });

    const initWorkbook = async () => {
      setLoading(true);

      try {
        const importResult = await resolveImportResult(data, src);

        if (disposed) {
          return;
        }

        univerAPI.createWorkbook(importResult.workbookData);
        // src 加载时同步默认导出文件名
        const fromSrc = fileNameFromSrc(src);
        if (fromSrc) {
          fileNameRef.current = toExportFileName(fromSrc);
        } else if (importResult.workbookData.name) {
          fileNameRef.current = toExportFileName(String(importResult.workbookData.name));
        }
        await applyViewMode(univerAPI, viewMode);
        if (resolvedFeatures.drawing) {
          await applyImportedImages(univerAPI, importResult.images);
        }
        onReadyRef.current?.(univerAPI);
      } catch (error) {
        onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    };

    initWorkbook();

    return () => {
      disposed = true;
      lifecycleDisposable.dispose();
      // 按 univer-integrate React 规范销毁 Univer 实例
      univer.dispose();
      univerRef.current = null;
      univerAPIRef.current = null;
    };
    // featuresKey 代替 features 对象引用，避免无意义重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, featuresKey, mode, resolvedShowExchange, src, univerTheme, viewMode]);

  return (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-exchanging`]: exchanging,
        [`${prefixCls}--simple`]: mode === 'simple',
        [`${prefixCls}--preview`]: viewMode === 'preview',
      })}
      style={{
        ...(width != null ? { width } : {}),
        ...(height != null ? { height } : {}),
        ...themeCssVars,
        ...style,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            importXlsxRef.current(file);
          }
          event.target.value = '';
        }}
      />
      <div ref={containerRef} className={`${prefixCls}-container`} />
      {loading || exchanging ? (
        <div className={`${prefixCls}-loading`}>
          <Spin size="large" description={exchanging ? '处理中...' : '加载中...'}>
            <div style={{ width: 120, height: 64 }} />
          </Spin>
        </div>
      ) : null}
    </div>
  );
};

const ExcelEditor = React.forwardRef<ExcelEditorHandle, ExcelEditorProps>(InternalExcelEditor);

ExcelEditor.defaultProps = {
  prefixCls: 'excel-editor',
  mode: 'simple',
  viewMode: 'edit',
};

export default ExcelEditor;
