import React, { useEffect, useState } from 'react';
import type { FileImageProps } from './interface';
export const imageInfo = {
  pdf: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/pdf.png',
  ppt: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/ppt.png',
  pdg: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/other.png',
  jpg: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/other.png',
  rar: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/zip.png',
  zip: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/zip.png',
  docx: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/word.png',
  doc: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/word.png',
  xlsx: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/excel.png',
  xls: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/excel.png',
  other: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/file/other.png',
};

function getFileAfter(fileName: string) {
  const file = String(fileName).split('.');
  return file[file.length - 1];
}

export default function FileImage(props: FileImageProps) {
  const { fileName, style = { width: 20, height: 20 }, className } = props;
  const [src, setSrc] = useState(imageInfo.other);

  useEffect(() => {
    const srcInfo = imageInfo[getFileAfter(fileName)];
    setSrc(srcInfo || imageInfo.other);
  }, []);

  return <img {...{ src, style, className }} />;
}
