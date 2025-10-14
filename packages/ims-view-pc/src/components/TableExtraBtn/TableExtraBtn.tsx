import { MoreOutlined } from '@ant-design/icons';
import { Divider, Popover, Space } from 'antd';
import { useMemo, type ReactNode } from 'react';
import BtnElement from './BtnElement';
import './index.less';
import type { TableExtraBtnProps } from './interface';

const TableExtraBtn = <T extends Record<string, any> = any>(props: TableExtraBtnProps<T>) => {
  const {
    btnList = [],
    maxShowMoreCount = 3,
    emptyText = <div>-</div>,
    record,
    spaceProps,
    popoverProps,
    clickCallBack,
    divider,
  } = props;

  const newBtnList = useMemo(() => {
    return btnList.filter((item) => {
      if (typeof item?.visible === 'function') {
        return item?.visible(record!);
      }
      return item?.visible ?? true;
    });
  }, [btnList, record]);

  const isShowMoreBtns = useMemo(() => {
    return newBtnList.length > maxShowMoreCount;
  }, [newBtnList.length, maxShowMoreCount]);

  if (newBtnList?.length === 0) return emptyText as ReactNode;

  return (
    <>
      <Space
        split={
          divider === false ? null : (
            <Divider
              type="vertical"
              className="table-extra-divider"
              style={{ borderColor: 'rgb(76 76 76 / 19%)' }}
            />
          )
        }
        {...spaceProps}
      >
        {newBtnList.slice(0, maxShowMoreCount).map((item, index) => (
          <BtnElement key={index} {...item} record={record} clickCallBack={clickCallBack} />
        ))}
      </Space>
      {isShowMoreBtns && (
        <Popover
          placement="top"
          trigger="hover"
          content={
            <div className="table-extra-popover-content">
              <Space direction="vertical">
                {newBtnList.slice(maxShowMoreCount).map((item, index) => (
                  <BtnElement key={index} {...item} record={record} clickCallBack={clickCallBack} />
                ))}
              </Space>
            </div>
          }
          {...popoverProps}
        >
          <MoreOutlined className="table-extra-more-icon" />
        </Popover>
      )}
    </>
  );
};

export default TableExtraBtn;
