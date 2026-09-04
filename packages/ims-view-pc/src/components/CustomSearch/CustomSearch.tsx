import type { ValueOf } from 'ims-view-pc';
import lodash from 'lodash';
import { useMemo, useState } from 'react';
import CustomForm, { ModalTypeEnum, type ModalType } from '../CustomForm';
import FilterTagBar from './FilterTagBar';
import { buildFormFilterTags } from './filterTagUtils';
import type { CustomSearchFilterTag, CustomSearchProps } from './interface';
import {
  collectDefaultSorterTags,
  collectTableFilterFormItems,
  enhanceTableSorterTags,
  type SortOrder,
  type TableSorterTag,
} from './tableSorterTags';

const CustomSearch = <T, R>(props: CustomSearchProps<T, R, ModalType>) => {
  const {
    formList = [],
    form,
    formProps,
    formValues,
    setSearchFormFields,
    children,
    enabledColumnsSearch = false,
    enabledFilterTags = true,
    filterTagContainerRef,
    filterTagBarRender,
    showFilterTagDivider = false,
  } = props;

  const defaultSorterTags = useMemo(() => collectDefaultSorterTags(children), [children]);
  const tableFilterFormItems = useMemo(() => collectTableFilterFormItems(children), [children]);
  const [controlledSorterTags, setSorterTags] = useState<TableSorterTag[]>();
  const [requestKey, setRequestKey] = useState(0);
  const sorterTags = controlledSorterTags ?? defaultSorterTags;

  const formTags = useMemo(
    () =>
      buildFormFilterTags(
        [...formList, ...tableFilterFormItems],
        formValues as Array<{ name: [PropertyKey]; value: unknown }>,
        form as any,
      ),
    [form, formList, formValues, tableFilterFormItems],
  );

  /**
   * 删除单个筛选或排序标签，并同步对应表单或表格状态。
   * @param tag 待删除的标签。
   */
  const handleRemoveTag = (tag: CustomSearchFilterTag) => {
    if (tag.sortOrder) {
      setSorterTags((current) => (current ?? sorterTags).filter((item) => item.key !== tag.key));
      return;
    }
    if (!tag.fieldName) return;
    form?.setFieldsValue({ [tag.fieldName]: undefined } as any);
    setSearchFormFields(formValues.filter((field) => String(field.name[0]) !== tag.fieldName));
  };

  /** 清空全部筛选与排序，包括页面默认排序。 */
  const handleResetTags = () => {
    formTags.forEach((tag) => {
      if (!tag.fieldName) return;
      form?.setFieldsValue({ [tag.fieldName]: undefined } as any);
    });
    form?.resetFields();
    setSearchFormFields([]);
    setSorterTags([]);
    setRequestKey((current) => current + 1);
  };

  /**
   * 从排序标签浮层切换排序方向。
   * @param tag 当前排序标签。
   * @param order 新排序方向。
   */
  const handleSortChange = (tag: CustomSearchFilterTag, order?: SortOrder) => {
    if (!tag.fieldName) return;
    if (!order) {
      handleRemoveTag(tag);
      return;
    }
    setSorterTags((current) =>
      (current ?? sorterTags).map((item) =>
        item.key === tag.key ? { ...item, sortOrder: order, valueText: order === 'ascend' ? '升序' : '降序' } : item,
      ),
    );
  };

  return (
    <>
      <CustomForm<T, R, typeof CustomForm.CONSTANT.MODAL_TYPE.normal>
        modalType={CustomForm.CONSTANT.MODAL_TYPE.normal}
        footer={null}
        {...props}
        rowProps={{
          wrap: true,
          gutter: [8, 8],
          style: {
            width: '100%',
          },
          ...props?.rowProps,
          className: `pl-1 ${enabledColumnsSearch && formProps?.className} ${
            props?.rowProps?.className
          }`,
        }}
        formList={formList}
        formProps={{
          layout: enabledColumnsSearch ? 'horizontal' : 'inline',
          autoComplete: 'off',
          fields: formValues,
          onFieldsChange: setSearchFormFields
            ? lodash.debounce((_, allFields) => {
                setSearchFormFields(allFields as { name: [keyof T]; value: ValueOf<T> }[]);
              }, 700)
            : undefined,
          ...formProps,
          className: enabledColumnsSearch ? undefined : formProps?.className,
        }}
      >
        {enabledFilterTags ? (
          <FilterTagBar
            tags={[...formTags, ...sorterTags]}
            onRemove={handleRemoveTag}
            onReset={handleResetTags}
            onSortChange={handleSortChange}
            containerRef={filterTagContainerRef}
            renderLayout={filterTagBarRender}
            showDivider={showFilterTagDivider}
          />
        ) : null}
        {enabledFilterTags ? enhanceTableSorterTags(children, sorterTags, setSorterTags, requestKey) : children}
      </CustomForm>
    </>
  );
};

export default CustomSearch;
