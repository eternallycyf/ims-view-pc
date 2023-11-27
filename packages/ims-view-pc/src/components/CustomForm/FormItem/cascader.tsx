import { useAsync } from '@ims-view/hooks';
import { Cascader, CascaderProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { DeepPartial, IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';

export interface ICascadeControlProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<CascaderProps<T>> & {
    onChange?: any;
  };
  onChange: (value: T) => any;
  value?: T;
}

const CascadeControl = React.forwardRef<any, ICascadeControlProps>((props, ref) => {
  const { controlProps, dict, form, id, itemProps, name, label, onChange, record, type, value } =
    props;

  const { value: options = [], loading } = useAsync<
    () => Promise<DefaultOptionType[]>
  >(async () => {
    if (props?.dict) return props?.dict || [];
    if (props?.fetchConfig?.request) {
      const res = await props?.fetchConfig?.request();
      return res || [];
    }
    return [];
  }, []);

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option?.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  useImperativeHandle(ref, () => ({}));

  return (
    <Cascader
      value={value}
      options={options}
      showSearch={{ filter }}
      onChange={onChange}
      loading={loading}
      placeholder={
        label && typeof label === 'string' && label?.length <= 5 ? `请选择${label}` : '请选择'
      }
      {...(controlProps as any as any)}
    />
  );
});

export default CascadeControl;
