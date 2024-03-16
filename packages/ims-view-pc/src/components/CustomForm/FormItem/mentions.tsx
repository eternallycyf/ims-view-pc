import { applyAwait } from '@ims-view/utils';
import { Cascader, CascaderProps, MentionProps, Mentions } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { DeepPartial, IBaseCustomFormItemProps } from 'ims-view-pc';
import _ from 'lodash';
import React, { useEffect, useImperativeHandle } from 'react';

export interface IMentionsControlProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<MentionProps> & {
    onChange?: any;
  };
  onChange: (value: T) => any;
  value?: T;
}

const MentionsControl = React.forwardRef<any, IMentionsControlProps>((props, ref) => {
  const { controlProps, dict, form, id, itemProps, name, label, onChange, record, type, value } =
    props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [options, setOptions] = React.useState<DefaultOptionType[]>([]);

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = async (searchKey: string = '') => {
    setLoading(true);
    const _getData = async () => {
      if (props?.dict) return props?.dict || [];
      if (props?.fetchConfig?.request) {
        const [err, data] = await applyAwait(props?.fetchConfig?.request(searchKey));
        if (err) return [];
        return data || [];
      }
      return [];
    };
    const data = await _getData();
    setLoading(false);
    setSearch(searchKey);
    setOptions(data);
  };

  useImperativeHandle(ref, () => ({}));

  return (
    <Mentions
      id={id}
      value={value}
      options={options}
      onSearch={props?.fetchConfig?.request && _.debounce(onSearch, 1000)}
      onChange={onChange}
      loading={loading}
      placeholder={
        label && typeof label === 'string' && label?.length <= 5 ? `请选择${label}` : '请选择'
      }
      {...(controlProps as any as any)}
    />
  );
});

export default MentionsControl;
