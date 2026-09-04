import { ArrowDownOutlined, ArrowUpOutlined, ClearOutlined, CloseOutlined } from '@ant-design/icons';
import { Divider, Popover, Select, Space, Tooltip, Typography } from 'antd';
import { Suspense, type ReactNode, type RefObject } from 'react';
import { variables } from '../../styles/variables';
import CustomForm from '../CustomForm';
import type { CustomSearchFilterTag, FilterTagBarRender } from './interface';

const TAG_DIVIDER_BORDER_COLOR = 'rgb(76 76 76 / 19%)';

type FilterTagBarProps = {
  tags: CustomSearchFilterTag[];
  onRemove: (tag: CustomSearchFilterTag) => void;
  onReset: () => void;
  onSortChange: (tag: CustomSearchFilterTag, order?: 'ascend' | 'descend') => void;
  containerRef?: RefObject<HTMLDivElement>;
  renderLayout?: FilterTagBarRender;
  showDivider?: boolean;
};

/**
 * 把标签标题收成可展示文案。
 * @param label 标签标题。
 * @returns 可拼接进标签的文案。
 */
function resolveTagLabelText(label: CustomSearchFilterTag['label']): string {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  return '';
}

/**
 * 把下拉、日期等浮层挂到当前标签弹层内，避免被弹层遮挡。
 * @param trigger 当前控件节点。
 * @returns 浮层挂载容器。
 */
function getTagEditorPopupContainer(trigger: HTMLElement) {
  return trigger.parentElement ?? document.body;
}

/**
 * 展示当前筛选条件，点击标签可改条件，支持单项关闭和一键清空。
 * @param props 标签数据与交互回调。
 * @returns 筛选标签区域。
 */
export default function FilterTagBar({
  tags,
  onRemove,
  onReset,
  onSortChange,
  containerRef,
  renderLayout,
  showDivider = false,
}: FilterTagBarProps) {
  if (!tags.length) return <div ref={containerRef} style={{ display: 'none' }} />;

  const extraNode = (
    <div style={{ display: 'flex', height: 24, flexShrink: 0, alignItems: 'center' }}>
      <Typography.Text type="secondary">
        已筛选 <span style={{ color: variables?.colorText }}>{tags.length}</span> 项
      </Typography.Text>
    </div>
  );

  const clearNode = (
    <Tooltip title="清空所有条件">
      <button
        type="button"
        aria-label="清空所有条件"
        style={{
          display: 'inline-flex',
          height: 24,
          width: 24,
          flexShrink: 0,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          padding: 0,
          color: variables?.colorTextSecondary,
        }}
        onClick={onReset}
      >
        <ClearOutlined style={{ fontSize: 14 }} />
      </button>
    </Tooltip>
  );

  const tagItems: ReactNode[] = tags.map((tag) => {
    const labelText = resolveTagLabelText(tag.label);
    const editor = tag.formItem ? (
      <div style={{ width: 260, padding: 4 }} onClick={(event) => event.stopPropagation()}>
        <Suspense fallback={null}>
          {CustomForm.renderFormItem({
            ...tag.formItem,
            form: true as any,
            label: undefined,
            itemProps: { ...tag.formItem.itemProps, label: undefined, style: { marginBottom: 0 } },
            controlProps: {
              ...tag.formItem.controlProps,
              popupMatchSelectWidth: true,
              style: {
                ...tag.formItem.controlProps?.style,
                width: 260,
                minWidth: 0,
                maxWidth: 260,
              },
              getPopupContainer: getTagEditorPopupContainer,
            },
          })}
        </Suspense>
      </div>
    ) : (
      <div style={{ width: 180, padding: 4 }} onClick={(event) => event.stopPropagation()}>
        <Select
          allowClear
          style={{ width: '100%' }}
          value={tag.sortOrder}
          options={[
            { label: '升序', value: 'ascend' },
            { label: '降序', value: 'descend' },
          ]}
          getPopupContainer={getTagEditorPopupContainer}
          onChange={(order) => onSortChange(tag, order)}
        />
      </div>
    );

    return (
      <Popover key={tag.key} trigger="click" content={editor} placement="bottomLeft" destroyOnHidden>
        <span
          style={{
            display: 'inline-flex',
            height: 24,
            maxWidth: 280,
            cursor: 'pointer',
            alignItems: 'center',
            borderRadius: 9999,
            backgroundColor: variables?.colorPrimaryBg,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12,
          }}
        >
          <Tooltip title={tag.valueText} placement="top">
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {labelText ? (
                <>
                  <span style={{ color: variables?.colorTextSecondary }}>{labelText}：</span>
                  <span style={{ color: variables?.colorPrimary }}>{tag.valueText}</span>
                </>
              ) : (
                <span style={{ color: variables?.colorPrimary }}>{tag.valueText}</span>
              )}
              {tag.sortOrder === 'ascend' ? (
                <ArrowUpOutlined style={{ marginLeft: 2, color: variables?.colorPrimary }} />
              ) : tag.sortOrder === 'descend' ? (
                <ArrowDownOutlined style={{ marginLeft: 2, color: variables?.colorPrimary }} />
              ) : null}
            </span>
          </Tooltip>
          <button
            type="button"
            aria-label="删除筛选"
            style={{
              marginLeft: 4,
              display: 'inline-flex',
              flexShrink: 0,
              cursor: 'pointer',
              alignItems: 'center',
              border: 'none',
              background: 'transparent',
              padding: 0,
              color: variables?.colorTextSecondary,
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRemove(tag);
            }}
          >
            <CloseOutlined style={{ fontSize: 12 }} />
          </button>
        </span>
      </Popover>
    );
  });

  const tagDivider = <Divider type="vertical" style={{ margin: 0, height: 20, borderColor: TAG_DIVIDER_BORDER_COLOR }} />;

  const tagNode = (
    <Space wrap align="center" size={[8, 6]} split={tagDivider}>
      {tagItems}
    </Space>
  );

  const defaultLayout = (
    <Space wrap align="center" size={[8, 4]} split={tagDivider}>
      {extraNode}
      {tagItems}
      {clearNode}
    </Space>
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minWidth: 0,
        flexBasis: '100%',
        borderLeft: '3px solid',
        borderLeftColor: variables?.colorPrimary,
        backgroundColor: variables?.colorFillQuaternary,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 8,
        marginBottom: 8,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {renderLayout?.(tagNode, extraNode) ?? defaultLayout}
      {showDivider ? <Divider style={{ margin: '4px 0', borderColor: TAG_DIVIDER_BORDER_COLOR }} /> : null}
    </div>
  );
}
