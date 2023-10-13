import { useFetch } from '@ims-view/hooks';
import { Card, Empty, List } from 'antd';
import _ from 'lodash';
import React, { Fragment, useImperativeHandle } from 'react';
import { AnyObject } from '../../../type/type';
import './index.less';
import { ICardListHandle, ICardListProps } from './interface';

const CardList: React.ForwardRefRenderFunction<ICardListHandle, ICardListProps> = (props, ref) => {
  const {
    title,
    extra,
    actions,
    column = 3,
    rowKey = 'index',
    renderItem,

    dataHandler,
    fetchConfig,
    request,
    cardProps,
    listProps,
    paginationProps,
  } = props;

  const [{ value: data, loading }, fetchData] = useFetch<AnyObject[]>({
    fetchConfig,
    dataHandler,
    request,
  });

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  return (
    <Fragment>
      <List<AnyObject>
        rowKey={rowKey}
        loading={loading}
        grid={{ column }}
        pagination={{ pageSize: 9, ...paginationProps }}
        dataSource={data}
        renderItem={(item, index) => {
          return (
            <Card
              style={{ margin: 12 }}
              key={rowKey}
              hoverable
              title={title}
              extra={extra}
              actions={actions}
              {...cardProps}
            >
              {renderItem ? renderItem(item, index) : <Empty />}
            </Card>
          );
        }}
        {...listProps}
      />
    </Fragment>
  );
};

export default CardList;
