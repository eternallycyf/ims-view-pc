import { ProFormSelect, type ProFormSelectProps } from '@ant-design/pro-form';
import { type DeepPartial, type IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';
import { CustomTooltip } from 'ims-view-pc';
import { renderMaxTagPlaceholder } from "../utils/maxTagPlaceholder";

export interface SelectControlProps<T = any> extends IBaseCustomFormItemProps<T> {
  controlProps: DeepPartial<Omit<ProFormSelectProps<T>, 'fieldProps'>> & {
    onChange?: any;
  } & ProFormSelectProps<T>['fieldProps'];
  onChange: any;
  value?: T;
}

/**
 * 下拉选择控件。兼容过期的下拉样式与开关配置，统一走 classNames / styles / popupRender / onOpenChange。
 * @param props 下拉选择配置
 * @param ref 表单项透出的实例
 */
const SelectControl = React.forwardRef<any, SelectControlProps>((props, ref) => {
  const { controlProps, dict, id, onChange, value } = props;
  const {
    popupClassName,
    dropdownClassName,
    dropdownStyle,
    dropdownRender,
    popupRender,
    onDropdownVisibleChange,
    onOpenChange,
    dropdownMatchSelectWidth,
    popupMatchSelectWidth,
    showArrow,
    bordered,
    variant,
    classNames,
    styles,
    ...restControlProps
  } = (controlProps || {}) as Record<string, any>;

  const popupRootClassName =
    [classNames?.popup?.root, popupClassName, dropdownClassName].filter(Boolean).join(' ') || undefined;
  const popupRootStyle = { ...dropdownStyle, ...styles?.popup?.root };

  useImperativeHandle(ref, () => ({}));

  return (
    <ProFormSelect
      formItemProps={{
        noStyle: true,
      }}
      id={id}
      value={value}
      showSearch
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
        options: dict || [],
        notFoundContent: props?.controlProps?.notFoundContent || <CustomTooltip.SelectEmpty />,
        maxTagPlaceholder: renderMaxTagPlaceholder,
        ...restControlProps,
        variant: variant ?? (bordered === false ? 'borderless' : undefined),
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
            root: popupRootClassName,
          },
        },
        styles: {
          ...styles,
          popup: {
            ...styles?.popup,
            root: popupRootStyle,
          },
        },
      }}
    />
  );
});

SelectControl.displayName = 'SelectControl';

export default SelectControl;
