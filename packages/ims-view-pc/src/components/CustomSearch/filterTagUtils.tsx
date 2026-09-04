import dayjs from 'dayjs';
import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { FormInstance } from 'antd';
import type { CustomFormList } from '../CustomForm/interface';
import type { FormControlType, Search } from '../../type';
import type { CustomSearchFilterTag } from './interface';

type TagFormatter = (value: unknown, item: Search<any>, values: Record<string, unknown>) => string;
type TagOption = { label?: ReactNode; value?: unknown; children?: TagOption[] };

/**
 * 将未知值安全转换为文本，避免对象直接进入 React 渲染链路。
 * @param value 待转换值。
 * @returns 安全文本。
 */
function toSafeText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') return String(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  return '';
}

/**
 * 获取筛选 Tag 标题，并清理搜索控件占位文案中的动作前缀。
 * @param item 当前表单配置。
 * @param fallbackItem 动态表单对应的叶子配置。
 * @param fieldName 当前字段名。
 * @returns Tag 标题。
 */
function resolveFormTagLabel(item: Search<any>, fallbackItem: Search<any>, fieldName: string): ReactNode {
  if (item.label !== undefined) return item.label;
  if (fallbackItem.label !== undefined) return fallbackItem.label;
  const placeholder = item.controlProps?.placeholder ?? fallbackItem.controlProps?.placeholder;
  if (typeof placeholder !== 'string') return fieldName;
  return placeholder.replace(/^(请输入|请选择|搜索)/, '') || placeholder;
}

/**
 * 在树形选项中查找指定值。
 * @param options 当前层选项。
 * @param value 待查找值。
 * @returns 命中的选项。
 */
function findTagOption(options: TagOption[] = [], value: unknown): TagOption | undefined {
  for (const option of options) {
    if (option.value === value) return option;
    const childOption = findTagOption(option.children, value);
    if (childOption) return childOption;
  }
  return undefined;
}

/**
 * 格式化选择类控件的值。
 * @param value 当前字段值。
 * @param item 当前表单配置。
 * @returns 选项文案。
 */
const formatOptionValue: TagFormatter = (value, item) => {
  const options = (item.controlProps?.options ?? item.dict) as TagOption[] | undefined;
  const option = findTagOption(options, value);
  return toSafeText(option?.label) || toSafeText((value as { label?: unknown })?.label) || toSafeText(value) || '已选择';
};

/**
 * 格式化日期类控件的值。
 * @param value 当前字段值。
 * @returns 日期文案。
 */
const formatDateValue: TagFormatter = (value, item) => {
  const dateValue = dayjs(value as dayjs.ConfigType);
  if (!dateValue.isValid()) return toSafeText(value);
  switch (item.type) {
    case 'time':
    case 'timeRange':
      return dateValue.format('HH:mm:ss');
    case 'month':
    case 'monthRange':
      return dateValue.format('YYYY-MM');
    case 'quarter':
    case 'quarterRange':
      return `${dateValue.format('YYYY')}-Q${Math.ceil((dateValue.month() + 1) / 3)}`;
    case 'year':
    case 'yearRange':
      return dateValue.format('YYYY');
    default:
      return dateValue.format('YYYY-MM-DD');
  }
};

/**
 * 格式化数组类控件的值。
 * @param value 当前字段值。
 * @param item 当前表单配置。
 * @param values 当前全部表单值。
 * @returns 多值文案。
 */
const formatArrayValue: TagFormatter = (value, item, values) => {
  if (!Array.isArray(value)) return '';
  const separator = item.type?.endsWith('Range') ? ' ~ ' : '、';
  return value
    .map((entry) => formatDefaultTagValue(entry, item, values))
    .filter(Boolean)
    .join(separator);
};

/**
 * 格式化标量控件值。
 * @param value 当前字段值。
 * @returns 标量文案。
 */
const formatScalarValue: TagFormatter = (value) => toSafeText(value);

const DEFAULT_TAG_FORMATTERS: Record<FormControlType, TagFormatter> = {
  input: formatScalarValue,
  password: formatScalarValue,
  search: formatScalarValue,
  textarea: formatScalarValue,
  inputNumber: formatScalarValue,
  radio: formatOptionValue,
  select: formatOptionValue,
  treeSelect: formatOptionValue,
  autoComplete: formatOptionValue,
  cascader: formatOptionValue,
  switch: formatScalarValue,
  rate: formatScalarValue,
  slider: formatScalarValue,
  date: formatDateValue,
  week: formatDateValue,
  month: formatDateValue,
  quarter: formatDateValue,
  year: formatDateValue,
  time: formatDateValue,
  dateRange: formatArrayValue,
  monthRange: formatArrayValue,
  quarterRange: formatArrayValue,
  yearRange: formatArrayValue,
  timeRange: formatArrayValue,
  weekRange: formatArrayValue,
  checkbox: formatArrayValue,
  mentions: formatScalarValue,
  upload: formatScalarValue,
  editor: formatScalarValue,
  custom: formatScalarValue,
  update: formatScalarValue,
};

/**
 * 判断表单值是否应生成筛选 Tag。
 * @param value 当前表单值。
 * @returns 是否为有效筛选值。
 */
export function hasFilterTagValue(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * 将表单值转换为适合 Tag 展示的短文本。
 * @param value 当前表单值。
 * @param item 对应表单项配置。
 * @returns Tag 展示值。
 */
export function formatDefaultTagValue(
  value: unknown,
  item: CustomFormList<any, any>[number],
  values: Record<string, unknown>,
): string {
  if (Array.isArray(value)) return formatArrayValue(value, item, values);
  if (dayjs.isDayjs(value)) return formatDateValue(value, item, values);
  const type = item.type as FormControlType | undefined;
  const formatter = type ? DEFAULT_TAG_FORMATTERS[type] : undefined;
  return formatter?.(value, item, values) || toSafeText(value) || '已选择';
}

/**
 * 获取字段的 Tag 文案，自定义渲染异常或返回非字符串时使用默认规则。
 * @param value 当前字段值。
 * @param item 当前表单配置。
 * @param values 当前全部表单值。
 * @returns Tag 值文案。
 */
export function formatFilterTagValue(
  value: unknown,
  item: CustomFormList<any, any>[number],
  values: Record<string, unknown>,
): string {
  try {
    const customText = item.tagValueRender?.(value, values);
    if (typeof customText === 'string') return customText;
  } catch {
    // 页面自定义格式化失败时回退到统一规则，避免阻断列表渲染。
  }
  return formatDefaultTagValue(value, item, values);
}

/**
 * 根据 formList 与当前字段生成有效筛选 Tag。
 * @param formList 搜索表单配置。
 * @param fields 当前受控表单字段。
 * @param form 当前表单实例，用于解析 update 动态子项。
 * @returns 当前有效筛选 Tag。
 */
export function buildFormFilterTags(
  formList: CustomFormList<any, any>,
  fields: Array<{ name: [PropertyKey]; value: unknown }>,
  form?: FormInstance<any>,
): CustomSearchFilterTag[] {
  const fieldMap = new Map(fields.map((field) => [String(field.name[0]), field.value]));
  const values = Object.fromEntries(fieldMap);
  const buildTags = (
    items: CustomFormList<any, any>,
    inheritedItem?: CustomFormList<any, any>[number],
  ): CustomSearchFilterTag[] =>
    items.flatMap((item) => {
      const childItems =
        item.type === 'update' && item.itemProps?.next && form
          ? item.itemProps.next(values, form)
          : typeof item.children === 'function' && form
            ? item.children(values, form)
            : item.children;
      if (childItems === false) return [];
      if (Array.isArray(childItems)) return buildTags(childItems, item.tagName ? item : inheritedItem);
      if (childItems && typeof childItems === 'object' && !isValidElement(childItems)) {
        return buildTags([childItems], item.tagName ? item : inheritedItem);
      }
      if (item.visible === false) return [];
      const tagConfig = item.tagName ? item : (inheritedItem ?? item);
      if (tagConfig.showFilterTag === false || item.showFilterTag === false) return [];
      const tagName = tagConfig.tagName ?? item.name;
      if (tagName === undefined) return [];
      const fieldName = String(Array.isArray(tagName) ? tagName.at(-1) : tagName);
      const value = fieldMap.get(fieldName);
      if (!hasFilterTagValue(value)) return [];
      const label = resolveFormTagLabel(tagConfig, item, fieldName);
      return [
        {
          key: `form:${fieldName}`,
          label,
          valueText: formatFilterTagValue(value, tagConfig, values),
          formItem: item,
          fieldName,
        },
      ];
    });

  const tags = buildTags(formList);
  return tags.filter((tag, index) => tags.findIndex((item) => item.key === tag.key) === index);
}

/**
 * 将 ReactNode 收窄为排序 Tag 可展示名称。
 * @param title 列标题。
 * @param fallback 列字段名。
 * @returns 排序 Tag 名称。
 */
export function resolveSorterTagLabel(title: ReactNode, fallback: string): ReactNode {
  return typeof title === 'string' || typeof title === 'number' ? title : fallback;
}
