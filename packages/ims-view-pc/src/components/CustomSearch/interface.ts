import type { ReactNode, RefObject } from 'react';
import type { ValueOf } from 'ims-view-pc';
import type { CustomFormProps, ModalType } from '../CustomForm';

/** 自定义标签区与「已筛选」区的渲染布局。 */
export type FilterTagBarRender = (tagNode: ReactNode, extraNode: ReactNode) => ReactNode;

/** 单个筛选或排序标签。 */
export type CustomSearchFilterTag = {
  key: string;
  label: ReactNode;
  valueText: string;
  formItem?: NonNullable<CustomFormProps<any, any, any>['formList']>[number];
  fieldName?: string;
  sortOrder?: 'ascend' | 'descend';
};

export type CustomSearchProps<
  T = Record<string, unknown>,
  R = Record<string, unknown>,
  Type extends ModalType = 'normal',
> = CustomFormProps<T, R, Type> & {
  formValues: {
    name: [keyof T]
    value: ValueOf<T>
  }[]
  setSearchFormFields: (allFields: { name: [keyof T]; value: ValueOf<T> }[]) => void
  /** 允许columns行内搜索 */
  enabledColumnsSearch?: boolean
  /** 是否展示当前筛选与排序标签，默认开启。 */
  enabledFilterTags?: boolean
  /** 标签容器引用，用于列表高度自适应。 */
  filterTagContainerRef?: RefObject<HTMLDivElement>
  /** 将筛选条件恢复为 initValues。 */
  resetFilterTags?: () => void
  /** 自定义标签区与「已筛选」区的渲染位置。 */
  filterTagBarRender?: FilterTagBarRender
  /** 筛选标签下方是否展示横向分割线，默认关闭。 */
  showFilterTagDivider?: boolean
}

export interface UseCustomSearchProps<T> {
  initValues?: Partial<Record<keyof T, ValueOf<T>>>
  className?: string
  setTableHeight?: (totalHeight: number, searchHeight: number, defaultHeight: number) => number
  defaultWrapperHeight?: number
  TableHeightDept?: any[]
  enabledColumnsSearch?: boolean
  /** 是否展示当前筛选与排序标签，默认开启。 */
  enabledFilterTags?: boolean
  /** 自定义标签区与「已筛选」区的渲染位置。 */
  filterTagBarRender?: FilterTagBarRender
  /** 筛选标签下方是否展示横向分割线，默认关闭。 */
  showFilterTagDivider?: boolean
}
