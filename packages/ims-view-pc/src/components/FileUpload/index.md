---
title: FileUpload
description: 上传文件
toc: content
group:
  title: 文件
demo:
  cols: 2
---

## FileUpload 上传文件

[FileUpload](https://github.com/eternallycyf/Antd-CustomComponent/blob/main/src/components/File/FileUpload/index.tsx)

## 单独使用

```tsx | pure
<Form.Item name="xxx">
  <FileUpload
    attachment={{
      label: 'xxx',
      name: 'name',
      isRequired: true,
      extraRecord: {
        busiType: 'XXX',
      },
      extra: [
        {
          text: '自定义按钮',
          type: 'primary',
          className: styles['btn-primary'],
        },
      ],
    }}
    actionUrl={'xxx'}
    isDetail={false}
    colNumber={8}
  />
</Form.Item>
```

## 公共组件中使用

```tsx | pure
{
  name: 'file',
  label: '附件上传',
  type: 'fileUpload',
  itemProps: {
    rules: [
      {
        validator: (_:any, fileList) => {
          if(fileList && fileList.length > 0) return Promise.resolve()
          return Promise.reject('请上传附件')
        }
      }
    ]
  },
  col: 24,
  controlProps: {
    attachment: {
      label: '附件上传',
      name: 'name',
      isRequired: true,
      extraRecord: {
        busiType: 'XXX',
      },
      extra: [
        {
          text: '自定义按钮',
          type: 'primary',
          className: styles['btn-primary'],
        },
      ],
    },
    actionUrl: 'xxx',
    isDetail: false,
    colNumber: 8,
  }
}
```
