import { Input, Popover, Typography } from 'antd';
import { useInfiniteScroll } from 'ahooks';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { variables } from 'ims-view-pc';
import CustomTag from '../CustomTag';
import type { CustomTagProps } from '../CustomTag/interface';

export interface CustomTooltipDropdownProps {
  /** 标签列表 */
  items: string[];
  /** 最大高度 */
  maxHeight?: number;
  /** 标签颜色 */
  color?: CustomTagProps['color'];
  /** 标签自定义类名 */
  tagClassName?: string;
  /** 外部首项标签的最大宽度，同时作为浮层内容的默认宽度 */
  width?: number;
  /** 浮层内容和标签的宽度，未传时使用 width */
  dropdownWidth?: number;
  /** 是否启用分批滚动渲染，默认开启，避免大量标签同时挂载 */
  isVirtualScroll?: boolean;
  /** 是否显示搜索框，默认开启 */
  showSearch?: boolean;
}

interface VirtualScrollData {
  list: string[];
  total: number;
  page: number;
}

const VIRTUAL_SCROLL_PAGE_SIZE = 30;

interface VirtualScrollListProps {
  items: string[];
  maxHeight: number;
  renderItem: (item: string, index: number) => ReactNode;
}

/**
 * 分批渲染浮层标签，并在滚动到底部时加载下一批。
 *
 * @param props 标签数据、浮层高度与单项渲染方法
 * @returns 支持滚动加载的标签列表
 */
const VirtualScrollList = (props: VirtualScrollListProps) => {
  const { items, maxHeight, renderItem } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data } = useInfiniteScroll<VirtualScrollData>(
    async (lastData) => {
      const page = (lastData?.page ?? 0) + 1;
      const start = (page - 1) * VIRTUAL_SCROLL_PAGE_SIZE;
      return {
        list: items.slice(start, start + VIRTUAL_SCROLL_PAGE_SIZE),
        total: items.length,
        page,
      };
    },
    {
      target: scrollRef,
      reloadDeps: [items],
      isNoMore: (currentData) => (currentData?.list.length ?? 0) >= items.length,
    },
  );

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'flex',
        minHeight: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight,
      }}
    >
      {(data?.list ?? []).map(renderItem)}
    </div>
  );
};

/**
 * 首屏展示一个条目，并在悬浮链接时展示完整列表。
 *
 * @param props 下拉展示配置
 * @returns 单条预览与完整列表浮层
 */
const Dropdown = (props: CustomTooltipDropdownProps) => {
  const {
    items,
    maxHeight = 240,
    color = 'processing',
    tagClassName,
    width = 140,
    dropdownWidth = width,
    isVirtualScroll = true,
    showSearch = true,
  } = props;
  const [searchText, setSearchText] = useState('');
  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLocaleLowerCase();
    return keyword ? items.filter((item) => item.toLocaleLowerCase().includes(keyword)) : items;
  }, [items, searchText]);

  if (items.length === 0) {
    return null;
  }

  /**
   * 将文本渲染为限制最大宽度的标签。
   *
   * @param item 标签文案
   * @param index 标签位置
   * @param maxWidth 标签最大宽度
   * @returns 标签节点
   */
  const renderTag = (item: string, index: number, maxWidth: number) => (
    <span key={`${item}-${index}`} style={{ display: 'inline-flex', maxWidth: '100%' }}>
      <CustomTag
        className={tagClassName}
        color={color}
        label={item}
        showDot={false}
        style={{ margin: 0, maxWidth, fontWeight: 'normal' }}
      />
    </span>
  );

  return (
    <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 8 }}>
      {renderTag(items[0], 0, width)}
      {items.length > 1 ? (
        <Popover
          content={
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: dropdownWidth, maxHeight }}>
              {showSearch ? (
                <Input
                  allowClear
                  style={{ marginBottom: 8, flexShrink: 0 }}
                  placeholder="搜索"
                  size="small"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              ) : null}
              <Typography.Text style={{ color: variables?.colorTextSecondary, marginBottom: 8, flexShrink: 0, fontSize: 12 }}>
                共{filteredItems.length}个
              </Typography.Text>
              {filteredItems.length === 0 ? (
                <Typography.Text style={{ color: variables?.colorTextSecondary, textAlign: 'center', fontSize: 12 }}>暂无匹配项</Typography.Text>
              ) : isVirtualScroll ? (
                <VirtualScrollList
                  items={filteredItems}
                  maxHeight={maxHeight}
                  renderItem={(item, index) => renderTag(item, index, dropdownWidth)}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    minHeight: 0,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 8,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    maxHeight,
                  }}
                >
                  {filteredItems.map((item, index) => renderTag(item, index, dropdownWidth))}
                </div>
              )}
            </div>
          }
          destroyOnHidden
          placement="bottomLeft"
          styles={{ root: { width: dropdownWidth + 32, maxWidth: dropdownWidth + 32 } }}
          trigger="hover"
        >
          <Typography.Link style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>等{items.length}个</Typography.Link>
        </Popover>
      ) : null}
    </div>
  );
};

export default Dropdown;
