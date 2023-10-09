import { getUUID } from '@ims-view/utils';
import { Button, Popconfirm, Space } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import ButtonGroup from './ButtonGroup';
import './index.less';
import { IAccessBtnProps, IButtonItemProps } from './interface';

const AccessBtn: React.FC<IAccessBtnProps> = (props) => {
  const { accessCollection = [], btnList, children, className } = props;
  const [button, setButton] = useState([]);

  useEffect(() => {
    const button = getButtonTpl(accessCollection);
    setButton(button);
  }, [btnList, children]);

  const getButtonTpl = (accessCollection: string[]) => {
    const accessCodeList = accessCollection.map((item) => item);

    const btnEleList = (btnList || []).map((btn, index) => {
      const { type, code, buttonType, element, visible, itemProps } = btn;
      const buttonProps = (btn?.itemProps?.buttonProps as IButtonItemProps['buttonProps']) || {};
      const buttonGroupProps = btn?.itemProps?.buttonGroupProps || {};
      const popConfirmProps = btn?.itemProps?.popConfirmProps || {};
      const { size = 'middle' } = buttonProps;
      const isVisible =
        visible === undefined
          ? true
          : typeof visible === 'function'
          ? visible(itemProps?.groupValue)
          : visible;

      if ((code && accessCodeList.indexOf(code) === -1) || !isVisible) return null;

      if (type === 'custom') return <Fragment key={index}>{element}</Fragment>;

      if (type === 'group') {
        const { groupDict, handleGroupValueOnChange, groupValue } = itemProps;
        return (
          <ButtonGroup
            value={groupValue}
            key={`access-${code || index}${getUUID()}`}
            dict={groupDict}
            getCurrentValue={handleGroupValueOnChange}
            buttonProps={buttonProps}
            buttonGroupProps={buttonGroupProps}
          />
        );
      }

      if (type === 'delete') {
        return (
          <Popconfirm
            key={index}
            title={itemProps?.deleteText || '确认删除该记录'}
            data-code={code || getUUID()}
            onConfirm={itemProps?.handleDeleteConfirm}
            okButtonProps={{ className: 'btn-primary' }}
            cancelButtonProps={{ className: 'btn-default' }}
            overlayStyle={{ maxWidth: 400 }}
            cancelText="取消"
            okText="确认"
            {...popConfirmProps}
          >
            <Button
              key={`access-${code || index}${getUUID()}`}
              size={size || 'middle'}
              danger
              type="link"
              {...buttonProps}
            >
              {element}
            </Button>
          </Popconfirm>
        );
      }

      return (
        <Button
          key={`access-${code || index}${getUUID()}`}
          size={size || 'middle'}
          type={buttonType || 'primary'}
          {...buttonProps}
        >
          {element}
        </Button>
      );
    });

    const childrenList =
      React.Children.map(children as any, (child: React.ReactElement<any>, index) => {
        if (!child) return null;

        const hasPerm =
          !child.props?.['data-code'] || accessCodeList.indexOf(child.props?.['data-code']) !== -1;
        if (hasPerm) {
          const key = child.props?.['data-code'] || index;
          return React.cloneElement(child, {
            key,
            size: child.props?.size || 'small',
          });
        }
        return null;
      }) || [];

    return [...btnEleList, ...childrenList].filter((item) => item);
  };

  return <Space className={className}>{button}</Space>;
};

export default React.memo(AccessBtn);
