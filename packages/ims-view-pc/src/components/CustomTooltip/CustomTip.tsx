import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip, type TooltipProps } from 'antd'
import type { ReactNode } from 'react'
import { variables } from 'ims-view-pc';

interface CustomTipProps {
  title?: ReactNode
  content?: ReactNode
  tooltipProps?: TooltipProps
  primary?: boolean
}

const CustomTip = (props: CustomTipProps) => {
  const { primary = false } = props
  return (
    <Tooltip overlayInnerStyle={{ maxWidth: 700 }} {...props?.tooltipProps} title={props?.title}>
      {props?.content && props?.content}
      <QuestionCircleOutlined
        style={{
          marginLeft: 2,
          color: primary ? variables?.colorPrimary : 'rgb(153,153,153)',
        }}
      />
    </Tooltip>
  )
}

export default CustomTip
