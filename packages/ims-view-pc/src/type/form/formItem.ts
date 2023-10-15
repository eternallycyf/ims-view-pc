import { AnyObject } from '../type';
import { IFieldComponentTypeParams } from './fieldCompType';

export interface IBaseCustomFormItemProps<Values = AnyObject, Rest = AnyObject, Extra = unknown>
  extends Pick<
    IFieldComponentTypeParams<Values, Rest, Extra>,
    'form' | 'itemProps' | 'name' | 'record' | 'dict' | 'Component'
  > {
  id?: IFieldComponentTypeParams<Values, Rest, Extra>['name'];
}
