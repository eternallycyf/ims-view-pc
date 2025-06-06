import { random } from '@ims-view/utils';
import { Col, Form, FormInstance, Row } from 'antd';
import {
  AnyObject,
  DeepPartial,
  IBaseCustomFormItemProps,
  ISearchesType,
  renderFormItem,
} from 'ims-view-pc';
import React, { Fragment, useImperativeHandle, useState } from 'react';

export type Next<Values = AnyObject, Rest = AnyObject, Extra = unknown, FormValues = Values> = (
  values: FormValues,
  form: Omit<FormInstance<FormValues>, 'scrollToField' | 'getFieldInstance'>,
  index?: number,
) => false | React.ReactNode | DeepPartial<ISearchesType<Values, Rest, Extra>>;

export interface IUpdateControlProps<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = unknown,
  FormValues = Values,
> {
  itemProps?: {
    shouldUpdate?: (prevValues: Values, nextValues: Values, index?: number) => boolean;
    /**@name index使用commonEditable 自动注入 */
    next?: Next<Values, Rest, Extra, FormValues>;
  };
}

const UpdateControl = React.forwardRef<any, IUpdateControlProps>((props, ref) => {
  const { itemProps = {}, ...controlProps } = props;
  const { next, shouldUpdate } = itemProps;

  useImperativeHandle(ref, () => ({}));

  if (!next) return null;

  const shouldUpdateProps = shouldUpdate
    ? {
        shouldUpdate: (pre, cru) => shouldUpdate(pre, cru),
      }
    : {};

  return (
    <Form.Item noStyle {...shouldUpdateProps}>
      {(form) => {
        const values = form.getFieldsValue();

        if (!next) return null;
        const nextValues = next(values, form);
        if (nextValues === false) return null;
        if (
          typeof nextValues === 'string' ||
          (React.isValidElement(nextValues) && !Array.isArray(nextValues))
        ) {
          return nextValues;
        }

        return (
          <Fragment key={random.getUUID()}>
            {((nextValues as any[]) || []).map((item: any, index: number) => (
              <Col span={item?.['col'] == undefined ? 24 : item?.['col'] || 0} key={index}>
                <Form.Item
                  labelAlign="right"
                  label={item?.label}
                  name={item?.name}
                  rules={item?.rules || []}
                  initialValue={item?.initialValue}
                  {...item.layout}
                  {...item.itemProps}
                >
                  {renderFormItem(item)}
                </Form.Item>
              </Col>
            ))}
          </Fragment>
        );
      }}
    </Form.Item>
  );
});

UpdateControl.defaultProps = {};

export default UpdateControl;
