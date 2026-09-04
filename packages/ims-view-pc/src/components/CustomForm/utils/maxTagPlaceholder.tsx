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
        <div style={{ display: 'flex', maxWidth: 280, flexWrap: 'wrap', gap: 4 }}>
          {tags.map((item) => (
            <Tag key={String(item?.value ?? item?.label)} style={{ margin: 0, whiteSpace: 'normal' }}>
              {item?.label}
            </Tag>
          ))}
        </div>
      }
    >
      <span style={{ cursor: 'default' }}>+{tags.length}...</span>
    </Popover>
  )
}
