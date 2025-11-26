import { App, Divider, Input, Select, Tag, Typography, type InputRef } from 'antd';
import { variables } from 'ims-view-pc';
import lodash from 'lodash';
import { FC, useRef, useState } from 'react';
import './index.less';

import type { ExpandSelectProps, ExpandSelectValue } from './interface';

const ExpandSelect: FC<ExpandSelectProps> = (props) => {
  const { message } = App.useApp();
  const { options = [], value, onChange, addInputPlaceholder = '请输入', ...restProps } = props;
  const [items, setItems] = useState(options);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (lodash.isNil(name) || name?.length === 0) {
      message.error('请输入名称');
      return;
    }
    if (items?.some((item) => item?.value === name)) {
      message.error('名称已存在');
      return;
    }
    setItems([...items, { label: name, value: name, isCustom: true }]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const renderLabel = (item: ExpandSelectValue, tagProps?: any) => {
    const isSelected = tagProps ? false : value?.some((ele) => ele?.value === item?.value);
    const isDisabled = item?.disabled;

    return (
      <Tag
        className={`expand-select-tag 
    ${isSelected && !isDisabled ? 'expand-select-tag-selected' : ''}
    ${!isSelected ? 'expand-select-tag-hoverable' : ''}
    ${isDisabled ? 'expand-select-tag-disabled' : ''}`}
        {...tagProps}
      >
        {item?.label}
      </Tag>
    );
  };

  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return renderLabel(
      { label, value },
      {
        closable,
        onMouseDown: onPreventMouseDown,
        onClose,
      },
    );
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      tagRender={tagRender}
      mode="multiple"
      maxTagCount="responsive"
      style={{ '--colorLink': variables?.colorLink }}
      showSearch
      labelInValue
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '8px',
            }}
          >
            <Input
              className="expand-select-input"
              placeholder={addInputPlaceholder}
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Typography.Link className="add-link" onClick={addItem}>
              添加
            </Typography.Link>
          </div>
        </>
      )}
      filterOption={(input, option) => {
        const label = option?.value;
        if (typeof label === 'string') return label?.toLowerCase().includes(input.toLowerCase());
        return false;
      }}
      virtual={false}
      allowClear
      classNames={{
        popup: {
          root: 'ExpandSelectBox',
        },
      }}
      styles={{
        popup: {
          root: {
            maxHeight: 400,
            minWidth: 300,
            overflow: 'auto',
            padding: 8,
          },
        },
      }}
      optionLabelProp="label"
      {...restProps}
    >
      {items?.map((item) => (
        <Select.Option disabled={item?.disabled} key={item?.value} value={item?.value}>
          {renderLabel(item)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ExpandSelect;
