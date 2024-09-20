import type { FormInstance, FormProps } from 'antd';
import { AnyObject, type Search } from 'ims-view-pc';

export type ISearchContext = {
  spanSize: number;
};

export type IFormatSubmitValues<Values = AnyObject> = {};

interface CommonSearchFormListCustomType {
  acpCode?: string;
  visible?: boolean;
  span?: number;
}

export type ICommonSearchType<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> = Search<
  Values,
  {
    children?: ICommonSearchType<Values, Rest & CommonSearchFormListCustomType, Extra>;
  } & Rest &
    CommonSearchFormListCustomType
>[];

export interface CommonSearchProps<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> {
  /**
   * @description
   * TODO: 如果使用 type === 'update' 响应式将出现问题, 暂时自行用state控制表单
   */
  formList?: ICommonSearchType<Values, Rest, Extra>;
  loading?: boolean;
  labelWidth?: number;
  itemBottomHeight?: number;
  collapsed?: boolean;
  accessCollection?: string[];

  onCollapse?: (collapsed: boolean) => void;
  onSearch?: (values: Values) => void;
  onChange?: FormProps<Values>['onFieldsChange'];
  onReset?: (values: Values) => void;

  className?: string;
  children?: React.ReactNode;
}

export type CommonSearchHandle<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> = {
  form: FormInstance<Values>;
  formatValues: (values: Values) => any;
  getRealValues: () => readonly [Values, IFormatSubmitValues<Values>];
};
