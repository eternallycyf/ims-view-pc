export interface ScrollHorizontalCardProps<T = { key: string }> {
  minWidth?: number
  className?: string
  rootClassName?: string
  style?: React.CSSProperties
  items: T[]
  itemWrapperClassName?: string
  itemWrapperStyle?: React.CSSProperties
  renderItem: (item: T, index: number) => React.ReactNode
  enabledQuickScrollButton?: boolean
  enabledScrollBar?: boolean
}