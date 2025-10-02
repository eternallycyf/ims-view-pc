import type { AnyObject, FieldCompType, FormControlType, Search } from 'ims-view-pc';
import type { ReactNode } from 'react';
import { SyncWaterfallHook, type Hook } from 'tapable';
import type { HookableConfig } from './Hookable';
import { Hookable } from './Hookable';
import { getFieldComp } from './index';

export interface FormRendererHooks<Values = AnyObject, Rest = AnyObject, Extra = FormControlType>
  extends Record<string, Hook<any, any>> {
  renderFormItem: SyncWaterfallHook<
    [Search<Values, Rest, Extra>, (item: Search<Values, Rest, Extra>) => ReactNode],
    ReactNode
  >;
}

export interface FormRendererConfig<Values = AnyObject, Rest = AnyObject, Extra = FormControlType>
  extends HookableConfig<
    FormRendererConfig<Values, Rest, Extra>,
    FormRendererHooks<Values, Rest, Extra>
  > {}

export class FormRenderer<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = FormControlType,
> extends Hookable<
  FormRendererConfig<Values, Rest, Extra>,
  FormRendererHooks<Values, Rest, Extra>
> {
  hooks: FormRendererHooks<Values, Rest, Extra> = {
    renderFormItem: new SyncWaterfallHook<
      [Search<Values, Rest, Extra>, (item: Search<Values, Rest, Extra>) => ReactNode],
      ReactNode
    >(['item', 'getFieldComp']),
  };

  getFieldComp = getFieldComp;

  renderFormItem(item: Search<Values, Rest, Extra>): ReactNode {
    const originalRender = (i: Search<Values, Rest, Extra>) =>
      this.getFieldComp(i as FieldCompType);
    return this.hooks.renderFormItem.call(item, originalRender);
  }
}
