import { useFetch } from '@ims-view/hooks';
import { Row, Skeleton } from 'antd';
import React, { Fragment, useImperativeHandle } from 'react';
import { renderTooltip } from '../../core/helpers/utils';
import AccessBtn from '../AccessBtn';
import SectionTitle from '../SectionTitle';
import './index.less';
import { IDescriptionsHandle, IDescriptionsProps } from './interface';
import { renderDetail } from './utils';

const CommonDesc: React.ForwardRefRenderFunction<IDescriptionsHandle, IDescriptionsProps> = (
  props,
  ref,
) => {
  const {
    fetchConfig,
    request,
    columns = [],
    dataHandler,
    dataSource,
    loading: defaultLoading,
    title: defaultTitle,
    tooltip,
    extra: defaultExtra,
    rowProps,
    className,
    labelClassName,
    wrapperClassName,
    beforeChildren,
    afterChildren,
    visible = true,
  } = props;
  const [{ value: data = {}, loading }, fetchData] = useFetch({
    fetchConfig,
    dataHandler,
    request,
  });

  useImperativeHandle(ref, () => ({
    fetchData,
    data,
  }));

  const title = defaultTitle ? renderTooltip(defaultTitle as string, tooltip) : undefined;
  const extraContent =
    defaultExtra && Array.isArray(defaultExtra) && !React.isValidElement(defaultExtra) ? (
      <AccessBtn btnList={defaultExtra} />
    ) : (
      defaultExtra
    );

  const currentData = dataSource != undefined ? dataSource : data;
  const currentLoading = defaultLoading != undefined ? defaultLoading : loading;

  const currentColumns = (columns || [])?.map((item) => ({
    ...item,
    labelClassName: item.labelClassName || labelClassName,
    wrapperClassName: item.wrapperClassName || wrapperClassName,
  }));

  if (!visible) return null;

  return (
    <Fragment>
      <Skeleton loading={currentLoading}>
        <div className={`CommonDescriptions ${className}`}>
          {beforeChildren}
          {(title || extraContent) && (
            <SectionTitle title={title} extraContent={extraContent as any} />
          )}
          <Row
            className="CommonDescriptions"
            gutter={[8, 8]}
            justify="start"
            align="middle"
            {...rowProps}
          >
            {renderDetail(currentColumns, currentData)}
          </Row>
          {afterChildren}
        </div>
      </Skeleton>
    </Fragment>
  );
};

export default CommonDesc;
