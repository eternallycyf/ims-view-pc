/* eslint-disable react-hooks/exhaustive-deps */
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import clsx from 'classnames'
import { CSSMotionList } from 'rc-motion'
import React from 'react'
import { useDebounceEffect } from 'ahooks'
import './index.less'
import type { ScrollHorizontalCardProps } from "./interface"

const ScrollHorizontalCard = <T extends { key: string }>({
  className,
  rootClassName,
  style,
  items = [],
  minWidth = 240,
  renderItem,
  enabledQuickScrollButton = true,
  enabledScrollBar = true,
  itemWrapperClassName,
}: ScrollHorizontalCardProps<T>) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [pingStart, setPingStart] = React.useState(false)
  const [pingEnd, setPingEnd] = React.useState(false)

  const mergedCls = clsx(
    "ScrollHorizontalCardList",
    rootClassName,
    className,
    "ScrollHorizontalScrollX",
    !enabledScrollBar && "ScrollHorizontalHiddenScrollBar",
    {
      "ScrollHorizontalPingStart": pingStart,
      "ScrollHorizontalPingEnd": pingEnd,
    },
  )

  const checkPing = React.useCallback(() => {
    const containerEle = containerRef.current
    if (!containerEle) return
    setPingStart(containerEle.scrollLeft > 0)
    setPingEnd(containerEle.scrollWidth - containerEle.clientWidth - containerEle.scrollLeft > 0)
  }, [items.length])

  useDebounceEffect(
    () => {
      checkPing()
    },
    [checkPing, items.length],
    { wait: 500 },
  )

  const scrollByOffset = (offset: number) => {
    containerRef.current?.scrollTo({
      left: containerRef.current.scrollLeft + offset * containerRef.current.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <div className="ScrollHorizontalCardWrapper">
      <div
        className={mergedCls}
        style={
          {
            '--min-width': minWidth + 'px',
            ...style,
          } as any
        }
        ref={containerRef}
        onScroll={checkPing}
      >
        <CSSMotionList
          keys={items.map((item, index) => ({ key: item?.key || `${index}`, item }))}
          motionName="ScrollHorizontalMotion"
          component={false}
          motionAppear={false}
          motionLeave
          motionEnter
        >
          {({ key, index, item, className: motionCls, style: motionStyle }: any) => {
            return (
              <div
                className={clsx("ScrollHorizontalItem", motionCls, itemWrapperClassName)}
                style={motionStyle}
                key={key}
              >
                {renderItem && renderItem(item, index)}
              </div>
            )
          }}
        </CSSMotionList>

        {enabledQuickScrollButton && (
          <>
            <Button
              size="small"
              shape="circle"
              className="ScrollHorizontalPrevBtn"
              icon={<LeftOutlined />}
              onClick={() => scrollByOffset(-1)}
              style={{ display: pingStart ? undefined : 'none' }}
            />
            <Button
              size="small"
              shape="circle"
              className="ScrollHorizontalNextBtn"
              icon={<RightOutlined />}
              onClick={() => scrollByOffset(1)}
              style={{ display: pingEnd ? undefined : 'none' }}
            />
          </>
        )}
      </div>
      {pingStart && <div className={clsx("ScrollHorizontalMask", "ScrollHorizontalMaskLeft")} />}
      {pingEnd && <div className={clsx("ScrollHorizontalMask", "ScrollHorizontalMaskRight")} />}
    </div>
  )
}

export default ScrollHorizontalCard
