import { ProFormTreeSelect } from '@ant-design/pro-form';
import { Spin, type GetProps } from 'antd';
import { DeepPartial, IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { renderMaxTagPlaceholder } from "../utils/maxTagPlaceholder";

type ProFormTreeSelectProps = GetProps<typeof ProFormTreeSelect>;

export interface ITreeSelectProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<Omit<ProFormTreeSelectProps, 'fieldProps'>> & {
    onChange?: any;
  } & ProFormTreeSelectProps['fieldProps'];
  onChange: any;
  value?: T;
}

/**
 * 树选择控件。兼容过期的边框和下拉配置，统一走 variant / onOpenChange / classNames.popup.root。
 * @param props 树选择配置
 * @param ref 表单项透出的实例
 */
const TreeSelectControl = React.forwardRef<any, ITreeSelectProps<any>>((props, ref) => {
  const { controlProps, dict, id, onChange, value } = props;
  const {
    bordered,
    onDropdownVisibleChange,
    onOpenChange,
    variant,
    popupClassName,
    dropdownClassName,
    dropdownStyle,
    dropdownRender,
    popupRender,
    dropdownMatchSelectWidth,
    popupMatchSelectWidth,
    showArrow,
    classNames,
    styles,
    ...restControlProps
  } = (controlProps || {}) as Record<string, any>;

  useImperativeHandle(ref, () => ({}));

  return (
    <ProFormTreeSelect
      formItemProps={{
        noStyle: true,
      }}
      id={id}
      request={async () => dict || []}
      value={value}
      {...(restControlProps as any)}
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
        autoExpandParent: true,
        height: 300,
        allowClear: true,
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'label',
        maxTagPlaceholder: renderMaxTagPlaceholder,
        switcherIcon: <DownOutlined style={{ fontSize: 10 }} />,
        virtual: false,
        ...restControlProps,
        variant: variant ?? (bordered === false ? 'borderless' : 'outlined'),
        onOpenChange: onOpenChange ?? onDropdownVisibleChange,
        popupRender: popupRender ?? dropdownRender,
        ...(popupMatchSelectWidth != null || dropdownMatchSelectWidth != null
          ? { popupMatchSelectWidth: popupMatchSelectWidth ?? dropdownMatchSelectWidth }
          : {}),
        ...(showArrow === false ? { suffixIcon: null } : {}),
        classNames: {
          ...classNames,
          popup: {
            ...classNames?.popup,
            root: [classNames?.popup?.root, popupClassName, dropdownClassName].filter(Boolean).join(' '),
          },
        },
        styles: {
          ...styles,
          popup: {
            root: { maxHeight: 400, overflow: 'auto', ...dropdownStyle, ...styles?.popup?.root },
          },
        },
      }}
    />
  );
});

TreeSelectControl.displayName = 'TreeSelectControl';

export default TreeSelectControl;
