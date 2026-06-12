import { Button, Form, Space } from 'antd';
import { MarkdownCodePreview } from 'ims-view-pc';
import React, { useRef } from 'react';

const initialMarkdown = `# 编辑区示例

在左侧编辑 Markdown，右侧实时预览。

- 支持 **Form.Item** 受控
- 可通过 ref 读取 \`getMarkdown\` / \`getHtml\`
`;

const App: React.FC = () => {
  const [form] = Form.useForm();
  const editorRef = useRef<React.ComponentRef<typeof MarkdownCodePreview>>(null);

  return (
    <div style={{ width: '100%', maxWidth: 960 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ content: initialMarkdown }}
        onFinish={(values) => console.log('submit:', values)}
      >
        <Form.Item name="content" label="Markdown 内容">
          <MarkdownCodePreview ref={editorRef} height={420} placeholder="请输入 Markdown..." />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              onClick={() => {
                const md = editorRef.current?.getMarkdown();
                console.log('markdown:', md);
              }}
            >
              打印 Markdown
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
