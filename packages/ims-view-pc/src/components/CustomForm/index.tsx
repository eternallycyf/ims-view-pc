import type { DrawerProps, FormInstance, FormProps, ModalProps, RowProps } from 'antd';
import { Search, type AnyObject, type DeepPartial, type FormControlType } from 'ims-view-pc';
import type { CSSProperties } from 'react';
import React, { RefObject } from 'react';
import { renderFormItem } from '../../core/helpers';
import CommonForm, { renderFormList } from './CustomForm';

/**
 * @name 弹窗类型
 * @enum {string}
 * @example normal 普通弹窗
 * @example modal 模态框
 * @example drawer 抽屉
 */

export enum ModalTypeEnum {
  normal = 'normal',
  modal = 'modal',
  drawer = 'drawer',
}

export type ModalType = 'modal' | 'drawer' | 'normal';

export type CustomFormList<Values = AnyObject, Rest = AnyObject, Extra = unknown> = (Search<
  Values,
  Rest,
  Extra
> & {
  col?: number;
  children?:
    | Search<Values, Rest, Extra>
    | ((values: Values, form: FormInstance<Values>) => CustomFormList<Values, Rest, Extra> | false);
})[];

export interface CustomFormHandle<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = ModalType,
> {
  form: FormInstance<Values>;
}

export interface BaseCustomFormProps<Values = AnyObject, Rest = AnyObject> {
  form?: FormInstance<Values>;
  formList?: CustomFormList<Values, Rest>;
  visible?: boolean;
  loading?: boolean;
  initialValues?: DeepPartial<Values>;
  onFinish?: FormProps<Values>['onFinish'];
  formProps?: Omit<FormProps<Values>, 'initialValues' | 'onFinish'>;
  onCancel?: (values: Values) => any;
  onDestroy?: Function;
  children?: React.ReactNode;
  modalType?: ModalType;
  rowProps?: RowProps;
  bodyScrollHeight?: number;
  style?: CSSProperties;
  className?: string;
  okButtonProps?: ModalProps['okButtonProps'];
  cancelButtonProps?: ModalProps['cancelButtonProps'];
  open?: boolean;
}

export type CustomFormProps<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = 'normal',
> = BaseCustomFormProps<Values, Rest> &
  (Type extends 'modal'
    ? Omit<ModalProps, 'onCancel' | 'children'>
    : Type extends 'drawer'
    ? Omit<DrawerProps, 'onCancel' | 'children'>
    : {
        footer?: React.ReactNode;
      });

const CompoundedCustomFrom = React.forwardRef<CustomFormHandle, CustomFormProps>(CommonForm) as <
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type extends ModalType = 'normal',
>(
  props: CustomFormProps<Values, Rest, Type> & {
    ref?: React.Ref<CustomFormHandle<Values, Rest, Type>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCustomFrom & {
  renderFormItem: typeof renderFormItem;
  renderFormList: typeof renderFormList;
};

const CustomForm = CompoundedCustomFrom as CompoundedComponent;

CustomForm.renderFormItem = renderFormItem;
CustomForm.renderFormList = renderFormList;

export default CustomForm;
