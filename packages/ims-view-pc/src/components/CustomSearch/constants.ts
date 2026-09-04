/** ProColumns 上保存列筛选表单配置的内部字段。 */
export const CUSTOM_SEARCH_FORM_ITEM_KEY = '__customSearchFormItem';

/**
 * 读取节点占用高度，含上下外边距。
 * @param element 目标节点。
 * @param observedHeight 内容区高度。
 * @returns 计入外边距后的占用高度。
 */
export function getOccupiedHeightWithMargin(element: HTMLElement | null, observedHeight: number): number {
  if (!element || observedHeight <= 0) return 0;
  const style = window.getComputedStyle(element);
  const marginTop = Number.parseFloat(style.marginTop) || 0;
  const marginBottom = Number.parseFloat(style.marginBottom) || 0;
  return observedHeight + marginTop + marginBottom;
}
