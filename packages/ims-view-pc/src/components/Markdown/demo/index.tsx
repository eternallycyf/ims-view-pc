import { Markdown } from 'ims-view-pc';
import React from 'react';

const sampleContent = `# Markdown 示例

支持 **粗体**、*斜体*、\`行内代码\` 与 [链接](https://ant.design)。

## 代码块

\`\`\`tsx
export function Hello() {
  return <span>Hello Markdown</span>
}
\`\`\`

## 表格

| 列 A | 列 B | 列 C |
| ---- | ---- | ---- |
| 短文本 | 这是一段较长的单元格内容，超出宽度时会省略并展示 Tooltip | 数值 |
| foo | bar | baz |
`;

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: 720, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
      <Markdown content={sampleContent} />
    </div>
  );
};

export default App;
