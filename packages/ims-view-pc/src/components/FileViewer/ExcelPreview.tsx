import jsPreviewExcel, { JsExcelPreview } from '@js-preview/excel';
import '@js-preview/excel/lib/index.css';
import { Spin } from 'antd';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';

const ExcelView: FC<{ fileSrc: string }> = ({ fileSrc }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previewerRef = useRef<JsExcelPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const previewFile = useCallback(async () => {
    if (!containerRef.current) return;

    if (!previewerRef.current) {
      previewerRef.current = jsPreviewExcel.init(containerRef.current);
    }

    setIsLoading(true);
    try {
      await previewerRef.current.preview(fileSrc);
      console.info('预览完成');
    } catch (err) {
      console.error('预览失败', err);
    } finally {
      setIsLoading(false);
    }
  }, [fileSrc]);

  useEffect(() => {
    previewFile();
  }, [previewFile]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%', overflow: 'auto' }} />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default ExcelView;
