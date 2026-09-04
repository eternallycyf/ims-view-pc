import { Empty } from 'antd';

export interface SelectEmptyProps {
  /** 容器高度 */
  height?: any;
  /** 提示文案 */
  title?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 下拉选择框空状态组件
 * @param props 空状态配置
 * @returns 空状态节点
 */
const SelectEmpty = (props: SelectEmptyProps) => {
  return (
    <Empty
      description={props?.title || '暂无数据'}
      style={{
        color: '#b3b8c2',
        fontSize: 12,
        height: props?.height || 80,
        display: 'grid',
        placeContent: 'center',
        ...props?.style,
      }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
};

export default SelectEmpty;
