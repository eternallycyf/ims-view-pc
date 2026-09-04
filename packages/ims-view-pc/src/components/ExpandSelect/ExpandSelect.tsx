import { App, Divider, Input, Select, Tag, Typography, type InputRef } from 'antd';
import { variables } from 'ims-view-pc';
import lodash from 'lodash';
import { FC, useEffect, useRef, useState, useMemo } from 'react';
import ButtonGroup from '../ButtonGroup';
import './index.less';

import type { ExpandSelectProps, ExpandSelectValue } from './interface';

const ExpandSelect: FC<ExpandSelectProps> = (props) => {
  const { message } = App.useApp();
  const {
    options = [],
    value,
    onChange,
    addInputPlaceholder = '请输入',
    categoryTabs = [],
    categoryOptionsMap = {},
    enableCategoryTab = false,
    onCategoryTabChange,
    popupClassName,
    dropdownClassName,
    dropdownStyle,
    dropdownRender,
    popupRender,
    classNames,
    styles,
    ...restProps
  } = props;
  const [items, setItems] = useState(options);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>(
    categoryTabs.length > 0 ? categoryTabs[0].value : '',
  );
  const [customItems, setCustomItems] = useState<ExpandSelectValue[]>([]);

  useEffect(() => {
    if (categoryTabs.length > 0 && !categoryTabs.find((tab) => tab.value === selectedCategoryTab)) {
      setSelectedCategoryTab(categoryTabs[0].value);
    }
  }, [categoryTabs, selectedCategoryTab]);

  const allOptions = useMemo(() => {
    if (!enableCategoryTab) {
      return [...options, ...customItems];
    }
    const allTabOptions: ExpandSelectValue[] = [];
    Object.values(categoryOptionsMap).forEach((tabOptions) => {
      allTabOptions.push(...tabOptions);
    });
    return [...allTabOptions, ...customItems];
  }, [options, customItems, enableCategoryTab, categoryOptionsMap]);

  const sortedOptions = useMemo(() => {
    const filteredOptions =
      enableCategoryTab && selectedCategoryTab ? categoryOptionsMap[selectedCategoryTab] || [] : options;
    if (!enableCategoryTab || selectedCategoryTab !== '全部') {
      return filteredOptions;
    }
    return [...filteredOptions, ...customItems];
  }, [options, enableCategoryTab, selectedCategoryTab, categoryOptionsMap, customItems]);

  const deduplicateOptions = (opts: ExpandSelectValue[]) => {
    const seen = new Set<string>();
    return opts.filter((opt) => {
      if (!opt.value) return false;
      const key = String(opt.value);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    const baseOptions = enableCategoryTab && selectedCategoryTab ? sortedOptions : options;

    if (enableCategoryTab && selectedCategoryTab === '其他') {
      setItems(deduplicateOptions([...baseOptions, ...customItems]));
    } else if (enableCategoryTab && selectedCategoryTab === '全部') {
      setItems(deduplicateOptions(baseOptions));
    } else if (enableCategoryTab) {
      setItems(deduplicateOptions(baseOptions));
    } else {
      setItems(deduplicateOptions([...baseOptions, ...customItems]));
    }
  }, [options, sortedOptions, enableCategoryTab, selectedCategoryTab, customItems]);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (lodash.isNil(name) || name?.length === 0) {
      message.error('请输入名称');
      return;
    }

    if (allOptions?.some((item) => item?.value === name)) {
      message.error('名称已存在');
      return;
    }

    const newCustomItem = { label: name, value: name, isCustom: true };
    setCustomItems([...customItems, newCustomItem]);
    setName('');

    if (enableCategoryTab && categoryTabs.length > 0 && selectedCategoryTab !== '全部') {
      const otherTab = categoryTabs.find((tab) => tab.value === '其他');
      if (otherTab) {
        setSelectedCategoryTab('其他');
        onCategoryTabChange?.('其他');
      }
    }

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
        style={{
          border: isSelected && !isDisabled ? `1px solid ${variables?.colorLink}` : '',
        }}
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
      filterOption={(input, option) => {
        const label = option?.value;
        if (typeof label === 'string') return label?.toLowerCase().includes(input.toLowerCase());
        return false;
      }}
      virtual={false}
      allowClear
      {...restProps}
      popupRender={
        popupRender ??
        dropdownRender ??
        ((menu) => (
          <>
            {enableCategoryTab && categoryTabs.length > 0 && (
              <>
                <div style={{ paddingBottom: 8 }}>
                  <ButtonGroup
                    value={selectedCategoryTab}
                    onChange={(value) => {
                      const tabValue = value as string;
                      setSelectedCategoryTab(tabValue);
                      onCategoryTabChange?.(tabValue);
                    }}
                    options={categoryTabs.map((tab) => {
                      if (tab.value === '全部') {
                        const totalOptions = [...(categoryOptionsMap[tab.value] || [])];
                        const seen = new Set<string>();
                        const uniqueOptions = totalOptions.filter((opt) => {
                          if (!opt.value) return false;
                          const key = String(opt.value);
                          if (seen.has(key)) {
                            return false;
                          }
                          seen.add(key);
                          return true;
                        });
                        const totalCount = uniqueOptions.length + customItems.length;
                        const globalSelectedCount = (value || []).length;
                        return {
                          ...tab,
                          label: `${tab.label}(${globalSelectedCount}/${totalCount})`,
                        };
                      } else {
                        const tabOptions = categoryOptionsMap[tab.value] || [];
                        const tabOptionValues = new Set(tabOptions.map((opt) => String(opt.value)));

                        if (tab.value === '其他') {
                          customItems.forEach((item) => {
                            if (item.value) {
                              tabOptionValues.add(String(item.value));
                            }
                          });
                        }

                        const tabSelectedCount = (value || []).filter((v) =>
                          v.value ? tabOptionValues.has(String(v.value)) : false,
                        ).length;
                        return {
                          ...tab,
                          label: `${tab.label}(${tabSelectedCount})`,
                        };
                      }
                    })}
                  />
                </div>
                <Divider style={{ margin: '8px 0' }} />
              </>
            )}
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
        ))
      }
      classNames={{
        ...classNames,
        popup: {
          ...classNames?.popup,
          root: ['ExpandSelectBox', classNames?.popup?.root, popupClassName, dropdownClassName]
            .filter(Boolean)
            .join(' '),
        },
      }}
      styles={{
        ...styles,
        popup: {
          ...styles?.popup,
          root: {
            maxHeight: enableCategoryTab ? 500 : 400,
            minWidth: enableCategoryTab ? 500 : 300,
            overflow: 'auto',
            padding: '8px',
            ...dropdownStyle,
            ...styles?.popup?.root,
          },
        },
      }}
      optionLabelProp="label"
    >
      {items?.map((item) => {
        return (
          <Select.Option disabled={item?.disabled} key={item?.value} value={item?.value}>
            {renderLabel(item)}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default ExpandSelect;
