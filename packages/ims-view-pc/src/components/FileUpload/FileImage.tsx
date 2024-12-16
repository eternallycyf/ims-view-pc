import {
  FileExcelOutlined,
  FileExclamationOutlined,
  FileGifOutlined,
  FileImageOutlined,
  FileJpgOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FileZipOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import type { FileImageProps } from './interface';

function getFileAfter(fileName: string) {
  const file = String(fileName).split('.');
  return file[file.length - 1];
}

export default function FileImage(props: FileImageProps) {
  const { fileName, style = { width: 20, height: 20 }, className } = props;
  const type = getFileAfter(fileName) || 'other';
  const componentsProps = {
    style: {
      fontSize: 20,
      ...style,
    },
    className,
  };

  if (type === 'pdf') return <FilePdfOutlined {...componentsProps} />;
  if (type === 'ppt') return <FilePptOutlined {...componentsProps} />;
  if (type === 'png') return <FileImageOutlined {...componentsProps} />;
  if (type === 'jpg') return <FileJpgOutlined {...componentsProps} />;
  if (type === 'rar') return <FileZipOutlined {...componentsProps} />;
  if (type === 'zip') return <FileZipOutlined {...componentsProps} />;
  if (type === 'docx') return <FileWordOutlined {...componentsProps} />;
  if (type === 'doc') return <FileWordOutlined {...componentsProps} />;
  if (type === 'xlsx') return <FileExcelOutlined {...componentsProps} />;
  if (type === 'xls') return <FileExcelOutlined {...componentsProps} />;
  if (type === 'gif') return <FileGifOutlined {...componentsProps} />;
  if (type === 'md') return <FileMarkdownOutlined {...componentsProps} />;
  return <FileExclamationOutlined {...componentsProps} />;
}
