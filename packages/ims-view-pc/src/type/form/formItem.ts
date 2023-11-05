import { AnyObject, Search } from 'ims-view-pc';

export interface IBaseCustomFormItemProps<Values = AnyObject, Rest = AnyObject, Extra = unknown>
  extends Pick<
    Search<Values, Rest, Extra>,
    'form' | 'itemProps' | 'name' | 'record' | 'dict' | 'Component'
  > {
  id?: string;
}
