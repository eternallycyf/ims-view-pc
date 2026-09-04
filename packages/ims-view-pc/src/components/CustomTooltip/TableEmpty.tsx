import { Empty } from 'antd';
import type { ReactNode } from 'react';

interface TableEmptyProps {
  /** 容器高度 */
  height?: React.CSSProperties['height'];
  /** 提示文案 */
  description?: ReactNode;
}

/**
 * 表格空状态组件
 * @param props 空状态配置
 * @returns 空状态节点
 */
const TableEmpty = (props: TableEmptyProps) => {
  return (
    <Empty
      description={props?.description || '暂无数据'}
      style={{
        color: '#b3b8c2',
        fontSize: 12,
        height: props?.height,
        display: 'grid',
        placeContent: 'center',
      }}
    />
  );
};

export default TableEmpty;
