import { ProFormSelect, type ProFormSelectProps } from '@ant-design/pro-form';
import { Spin } from 'antd';
import { Attachment, type DeepPartial, type IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';

export interface SelectControlProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<Omit<ProFormSelectProps<T>, 'fieldProps'>> & {
    onChange?: any;
  } & DeepPartial<ProFormSelectProps<T>['fieldProps']>;
  onChange: any;
  value?: T;
}

const SelectControl = React.forwardRef<any, SelectControlProps<Attachment[]>>((props, ref) => {
  const { controlProps, dict, id, onChange, value } = props;

  useImperativeHandle(ref, () => ({}));

  return (
    <ProFormSelect
      formItemProps={{
        noStyle: true,
      }}
      id={id}
      value={value}
      showSearch
      {...(controlProps as any)}
      onChange={(...args: any[]) => {
        if (onChange) {
          onChange(...args);
        }
        if (props?.controlProps?.onChange) {
          props?.controlProps?.onChange(...args);
        }
      }}
      fieldProps={{
        options: dict,
        notFoundContent: props?.controlProps?.loading ? <Spin spinning /> : null,
        ...controlProps,
      }}
    />
  );
});

export default SelectControl;
