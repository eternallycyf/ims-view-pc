import type { FormInstance, FormProps } from 'antd';
import { AnyObject, type Search } from 'ims-view-pc';

export type IFormatSubmitValues<Values = AnyObject> = {};

export interface CommonSearchProps<Values = AnyObject, Params = AnyObject, Rest = AnyObject> {
  formList?: Search<
    Values,
    {
      children?: CommonSearchProps<Values, Params, Rest>['formList'];
      acpCode?: string;
      visible?: boolean;
      span?: number;
    }
  >[];
  collapsed?: boolean;
  columnNumber?: number;
  accessCollection?: string[];

  onCollapse?: (collapsed: boolean) => void;
  onSearch?: (values: Values) => void;
  onChange?: FormProps<Values>['onFieldsChange'];
  onReset?: (values: Values) => void;

  className?: string;
  children?: (context: CommonSearchContext<Values, Params, Rest>) => React.ReactNode;
}

export interface CommonSearchContext<Values = AnyObject, Params = AnyObject, Rest = AnyObject> {
  form: FormInstance<Values>;
  values: Values;
}

export type CommonSearchHandle<Values = AnyObject, Params = AnyObject, Rest = AnyObject> = {
  form: FormInstance<Values>;
  formatValues: (values: Values) => any;
  getRealValues: () => readonly [Values, IFormatSubmitValues<Values>];
};
