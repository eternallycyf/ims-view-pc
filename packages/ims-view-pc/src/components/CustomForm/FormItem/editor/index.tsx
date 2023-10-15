import { IDomEditor, IEditorConfig, IToolbarConfig, SlateNode } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Flex } from 'antd';
import { variables } from 'ims-view-pc/styles/variables';
import { IBaseCustomFormItemProps } from 'ims-view-pc/type/form/formItem';
import React, { FC, useEffect, useState } from 'react';
import './index.less';
import { insertImg, uploadImg } from './utils';

export interface IEditorProps<T = string> extends IBaseCustomFormItemProps {
  controlProps: {
    maxLength?: number;
    toolbarConfig?: Partial<IToolbarConfig>;
    editorConfig?: Partial<IEditorConfig>;
  };
  onChange: (value: T) => any;
  type: 'editor';
  value: T;
}

const MyEditor: FC<IEditorProps> = (props) => {
  const { value, onChange, itemProps } = props;
  const [editor, setEditor] = useState<IDomEditor | null>();
  const [toolbarConfig, setToolbarConfig] = useState<Partial<IToolbarConfig>>({});
  const [editorConfig, setEditorConfig] = useState<Partial<IEditorConfig>>({});

  const [html, setHtml] = useState<string>(itemProps?.initialValue);

  useEffect(() => {
    handleInitConfig();
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      setHtml(value);
    };
  }, [editor]);

  const handleInitConfig = () => {
    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {};

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      // maxLength: 1000000,
      // onMaxLength(editor) {
      //   alert('超过了最大长度');
      // },
      MENU_CONF: {
        //配置上传图片
        uploadImage: {
          // 自定义上传图片 方法
          customUpload: uploadImg,
          // 自定义插入图片 方法
          customInsert: insertImg,
          //server必须要配置正确
          // server: 'https://xxx',

          maxFileSize: 4 * 1024 * 1024,
          maxNumberOfFiles: 100,
          allowedFileTypes: ['images/*'],
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          fieldName: 'file',
          meta: {
            //官网中把token放到了这里，但是请求的时候会看不到token
          },
          headers: {
            //所以token放这里
            // token: window.sessionStorage.token,
          },
          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,
          // 跨域是否传递 cookie ，默认为 false
          withCredentials: false,
          // 超时时间，默认为 10 秒
          timeout: 5 * 1000, // 5 秒
        },
        // 配置上传视频（同上传图片）
        uploadVideo: {},
      },
    };

    setToolbarConfig(toolbarConfig);
    setEditorConfig(editorConfig);
  };

  const handleOnChange = (editor: IDomEditor) => {
    const html = editor.getHtml();
    onChange(html);
    setHtml(html);
  };

  return (
    <>
      <div>
        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
          <div className="content">
            <div className="editor-container">
              <div className="title-container">
                <input placeholder="Page title..."></input>
              </div>
              <Flex gap={10}>
                <div style={{ width: '100%' }}>
                  <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={handleOnChange}
                    mode="default"
                  />
                </div>
              </Flex>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyEditor;
