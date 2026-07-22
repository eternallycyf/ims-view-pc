import { Popover, Tag } from 'antd'
import type { ReactNode } from 'react'

export type OmittedTagValue = { label?: ReactNode; value?: React.Key }

const MAX_TAG_POPOVER_Z_INDEX = 1100

export function renderMaxTagPlaceholder(omittedValues: OmittedTagValue[] = []) {
  const tags = omittedValues || []
  return (
    <Popover
      placement="top"
      zIndex={MAX_TAG_POPOVER_Z_INDEX}
      getPopupContainer={() => document.body}
      overlayInnerStyle={{ maxWidth: 300 }}
      content={
        <div className="flex max-w-[280px] flex-wrap gap-1">
          {tags.map((item) => (
            <Tag key={String(item?.value ?? item?.label)} className="!m-0 whitespace-normal">
              {item?.label}
            </Tag>
          ))}
        </div>
      }
    >
      <span className="cursor-default">+{tags.length}...</span>
    </Popover>
  )
}
