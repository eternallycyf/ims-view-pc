import type { CSSProperties, ReactNode } from 'react'
import type { TooltipProps } from 'antd'

export interface SectionTitleProps {
  title?: ReactNode
  /** 问号图标附加属性 */
  iconProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  extraContent?: ReactNode
  className?: string
  titleClassName?: string
  rowStyle?: CSSProperties
  titleStyle?: CSSProperties
  tooltip?: ReactNode
  tooltipProps?: TooltipProps
  /** 是否展示标题前的主题色竖条，默认开启 */
  showPrefixBar?: boolean
  children?: ReactNode
}
