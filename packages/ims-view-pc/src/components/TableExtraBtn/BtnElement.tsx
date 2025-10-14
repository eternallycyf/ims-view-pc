import { Button, Popconfirm, Spin, Typography } from 'antd';
import { useState } from 'react';
import './index.less';
import type { ElementProps } from './interface';

const BtnElement = <T extends Record<string, any>>(item: ElementProps<T>) => {
  const { record: _record, type = 'link', buttonProps, typographyProps, popconfirmProps } = item;
  const [loading, setLoading] = useState<boolean>(false);
  const record = {
    ...(_record || ({} as T)),
  };

  const newParams = {
    loading,
    setLoading,
  };

  const handleOnClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await item?.onClick?.(record!, newParams);
      if (item?.clickCallBack) {
        await item?.clickCallBack(record!, newParams);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderElement = () => {
    if (typeof item?.element === 'function') {
      return item?.element(record!, newParams);
    }
    return item?.element;
  };

  if (type === 'link') {
    return (
      <Spin size="small" spinning={loading}>
        <Typography.Link
          onClick={() => handleOnClick()}
          {...typographyProps}
          className={`btn-element-link ${typographyProps?.className || ''}`}
        >
          {renderElement()}
        </Typography.Link>
      </Spin>
    );
  }

  if (type === 'delete') {
    return (
      <Popconfirm
        title={popconfirmProps?.title || '确认删除该记录?'}
        onConfirm={async () => await handleOnClick()}
        okButtonProps={{ className: 'btn-primary', loading }}
        cancelButtonProps={{ className: 'btn-default' }}
        overlayStyle={{ maxWidth: 400 }}
        cancelText="取消"
        okText="确认"
        placement="bottomLeft"
        {...popconfirmProps}
      >
        <Spin size="small" spinning={loading}>
          <Typography.Link
            type="danger"
            {...typographyProps}
            className={`btn-element-link ${typographyProps?.className || ''}`}
          >
            {renderElement()}
          </Typography.Link>
        </Spin>
      </Popconfirm>
    );
  }

  if (type === 'button') {
    return (
      <Button loading={loading} type="primary" onClick={() => handleOnClick()} {...buttonProps}>
        {renderElement()}
      </Button>
    );
  }

  return renderElement();
};

export default BtnElement;
