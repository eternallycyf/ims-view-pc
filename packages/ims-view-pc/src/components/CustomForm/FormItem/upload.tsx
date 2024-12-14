import {
  Attachment,
  FileUpload,
  FileUploadProps,
  type DeepPartial,
  type IBaseCustomFormItemProps,
} from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';

export interface IFileUploadControlProps<T extends Attachment[]>
  extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<FileUploadProps> & {
    onChange?: any;
  };
  onChange: (value: T) => any;
  value?: T;
}

const UploadControl = React.forwardRef<any, IFileUploadControlProps<Attachment[]>>((props, ref) => {
  const { controlProps, dict, form, id, itemProps, name, label, onChange, record, type, value } =
    props;

  useImperativeHandle(ref, () => ({}));

  return (
    <FileUpload
      isDetail={false}
      colNumber={24}
      {...(controlProps as any)}
      value={value as any}
      onChange={onChange}
    />
  );
});

export default UploadControl;
