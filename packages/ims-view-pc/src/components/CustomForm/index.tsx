import type { DrawerProps, FormInstance, FormProps, ModalProps } from 'antd';
import { Search } from 'ims-view-pc';
import React, { RefObject } from 'react';
import CommonForm from './CustomForm';

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

export type CustomFormList<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Extra = unknown,
> = (Search<Values, Rest, Extra> & {
  col?: number;
  children?:
    | Search<Values, Rest, Extra>
    | ((values: Values, form: FormInstance<Values>) => CustomFormList<Values, Rest, Extra> | false);
})[];

export type BaseCustomFormProps<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = 'normal',
> = {
  className?: string;
  visible?: boolean;
  loading?: boolean;

  form?: FormInstance<Values>;
  formRef?: RefObject<FormInstance<Values>>;

  formList?: CustomFormList<Values, Rest, ModalType>;
  initialValues?: Values;

  onFinish?: FormProps<Values>['onFinish'];
  onCancel?: (values: Values) => any;
  onDestroy?: Function;

  formProps?: Omit<FormProps<Values>, 'initialValues' | 'onFinish'>;

  children?: React.ReactNode;
  modalType?: ModalType;
};

export type CustomFormProps<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = 'normal',
> = BaseCustomFormProps<Values, Rest, Type> &
  (Type extends 'modal'
    ? Omit<ModalProps, 'onCancel'>
    : Type extends 'drawer'
    ? Omit<DrawerProps, 'onCancel'>
    : {});

export interface CustomFormHandle<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = 'normal',
> {
  form: FormInstance<Values>;
}

const CompoundedCustomFrom = React.forwardRef<CustomFormHandle, CustomFormProps>(CommonForm) as <
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type extends ModalType = 'normal',
>(
  props: CustomFormProps<Values, Rest, Type> & {
    ref?: React.Ref<CustomFormHandle<Values, Rest, Type>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCustomFrom & {};

const CustomForm = CompoundedCustomFrom as CompoundedComponent;

export default CustomForm;
