import { ProFormTreeSelect } from '@ant-design/pro-form';
import { Spin, type GetProps } from 'antd';
import { DeepPartial, IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';

type ProFormTreeSelectProps = GetProps<typeof ProFormTreeSelect>;

export interface ITreeSelectProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<Omit<ProFormTreeSelectProps, 'fieldProps'>> & {
    onChange?: any;
  } & ProFormTreeSelectProps['fieldProps'];
  onChange: any;
  value?: T;
}

const TreeSelectControl = React.forwardRef<any, ITreeSelectProps<any>>((props, ref) => {
  const { controlProps, dict, id, onChange, value } = props;

  useImperativeHandle(ref, () => ({}));

  return (
    <ProFormTreeSelect
      formItemProps={{
        noStyle: true,
      }}
      id={id}
      request={async () => dict}
      value={value}
      {...(controlProps as any as any)}
      onChange={(...args: any[]) => {
        if (onChange) {
          onChange(...args);
        }
        if (props?.controlProps?.onChange) {
          props?.controlProps?.onChange(...args);
        }
      }}
      fieldProps={{
        labelInValue: true,
        notFoundContent: props?.controlProps?.loading ? <Spin spinning /> : null,
        fieldNames: {
          title: 'label',
          value: 'value',
          children: 'children',
        },
        allowClear: true,
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'label',
        ...controlProps,
      }}
    />
  );
});

TreeSelectControl.displayName = 'TreeSelectControl';

export default TreeSelectControl;
