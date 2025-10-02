import { AnyObject, Search, type FormControlType } from 'ims-view-pc';

export interface IBaseCustomFormItemProps<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = FormControlType,
> extends Pick<
    Search<Values, Rest, Extra>,
    | 'form'
    | 'itemProps'
    | 'name'
    | 'record'
    | 'dict'
    | 'Component'
    | 'fetchConfig'
    | 'type'
    | 'label'
  > {
  id?: string;
}
