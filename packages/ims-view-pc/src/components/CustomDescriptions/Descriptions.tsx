import { ProDescriptions } from '@ant-design/pro-descriptions';
import './index.less';
import type { CustomDescriptionsProps } from './interface';
import cx from 'classnames'
const Descriptions = (props: CustomDescriptionsProps) => {
  const isVertical = props?.layout === 'vertical'
  return (
    <ProDescriptions
      {...props}
      className={cx(
        props?.className,
        'custom-descriptions',
        isVertical ? 'custom-descriptions-vertical' : 'custom-descriptions-horizontal',
      )}
    />
  )
}

export default Descriptions

