import React from 'react';
import FileImage from './FileImage';
import CommonFileUpload from './FileUpload';

type CompoundedComponent = typeof CommonFileUpload & {
  FileImage: typeof FileImage;
};

const FileUpload = CommonFileUpload as CompoundedComponent;

FileUpload.FileImage = FileImage;

export default FileUpload;
