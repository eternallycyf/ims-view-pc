import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import classnames from 'classnames'
import { variables } from 'ims-view-pc'
import type { SectionTitleProps } from './interface'
import CustomTooltip from '../CustomTooltip'

export const renderTooltip = (
  tooltip: SectionTitleProps['tooltip'],
  props: SectionTitleProps['tooltipProps'],
  iconProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <span style={{ marginLeft: 6, display: 'inline-flex', flexShrink: 0, alignItems: 'center' }}>
      <Tooltip title={tooltip} overlayStyle={{ maxWidth: 700 }} {...props}>
        <QuestionCircleOutlined
          {...iconProps}
          className={iconProps?.className}
          style={{ fontSize: 16, color: variables?.colorTextQuaternary, ...iconProps?.style }}
        />
      </Tooltip>
    </span>
  )
}

/**
 * 区块标题：左侧标题与问号提示，右侧可放额外内容。
 * @param props.title 标题文案
 * @param props.iconProps 问号图标附加属性
 * @param props.extraContent 标题右侧内容
 * @param props.className 外层样式名
 * @param props.titleClassName 标题样式名
 * @param props.rowStyle 外层样式
 * @param props.titleStyle 标题样式
 * @param props.tooltip 问号提示内容
 * @param props.tooltipProps 问号提示附加属性
 * @param props.showPrefixBar 是否展示标题前的主题色竖条，默认开启
 * @param props.children 标题下方内容
 */
const SectionTitle = (props: SectionTitleProps) => {
  const {
    title,
    iconProps,
    extraContent,
    className,
    titleClassName,
    rowStyle,
    titleStyle,
    tooltip,
    tooltipProps,
    showPrefixBar = true,
    children,
  } = props

  return (
    <>
      <div
        className={classnames(className)}
        style={{ display: 'flex', minWidth: 0, alignItems: 'flex-start', justifyContent: 'space-between', ...rowStyle }}
      >
        <div style={{ display: 'flex', minHeight: 32, minWidth: 0, alignItems: 'center', fontWeight: 600, lineHeight: 1 }}>
          {showPrefixBar ? <span style={{ backgroundColor: variables?.colorPrimary, marginRight: 6, height: 14, width: 4, flexShrink: 0 }} aria-hidden /> : null}
          <CustomTooltip.Paragraph className={titleClassName} style={titleStyle} content={title} />
          {tooltip ? renderTooltip(tooltip, tooltipProps, iconProps) : null}
        </div>
        {extraContent ? <div style={{ display: 'flex', minHeight: 32, flexShrink: 0, alignItems: 'center' }}>{extraContent}</div> : null}
      </div>
      {children}
    </>
  )
}

export default SectionTitle
export type { SectionTitleProps } from './interface'
