import { Button, Space } from 'antd';
import { Markdown } from 'ims-view-pc';
import React, { useCallback, useEffect, useRef, useState } from 'react';

/** 模拟 SSE 分片返回的 Markdown 片段 */
const STREAM_CHUNKS = [
  '# 流式 Markdown 输出\n\n',
  '正在逐段接收内容，模拟对话场景下的 **实时渲染**。\n\n',
  '## 列表示例\n\n',
  '1. 第一段说明\n',
  '2. 第二段说明\n',
  '3. 第三段说明\n\n',
  '## 代码块\n\n',
  '```tsx\n',
  'function streamDemo() {\n',
  '  return "chunk by chunk"\n',
  '}\n',
  '```\n\n',
  '## 表格\n\n',
  '| 字段 | 值 |\n',
  '| ---- | ---- |\n',
  '| 状态 | 流式输出中 |\n',
  '| 模式 | incremental |\n\n',
  '内容接收完毕 ✅\n',
];

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [streaming, setStreaming] = useState(false);
  const timerRef = useRef<number>();

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const startStream = useCallback(() => {
    clearTimer();
    setContent('');
    setStreaming(true);

    let index = 0;
    timerRef.current = window.setInterval(() => {
      if (index >= STREAM_CHUNKS.length) {
        clearTimer();
        setStreaming(false);
        return;
      }
      setContent((prev) => prev + STREAM_CHUNKS[index]);
      index += 1;
    }, 320);
  }, [clearTimer]);

  useEffect(() => {
    startStream();
    return clearTimer;
  }, [clearTimer, startStream]);

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={startStream} loading={streaming}>
          {streaming ? '接收中…' : '重新播放'}
        </Button>
      </Space>
      <div
        style={{
          padding: 16,
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          minHeight: 280,
        }}
      >
        <Markdown content={content} renderMode="immediate" />
      </div>
    </div>
  );
};

export default App;
