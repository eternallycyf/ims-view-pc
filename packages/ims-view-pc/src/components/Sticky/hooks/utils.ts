import { MutableRefObject } from 'react';
type ScrollElement = Element | Window;

export const inBrowser = typeof window !== 'undefined';
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}

export const extend = Object.assign;

export function getZIndexStyle(zIndex?: string | number) {
  const style: React.CSSProperties = {};
  if (zIndex !== undefined) {
    style.zIndex = +zIndex;
  }
  return style;
}

export function isHidden(elementRef: HTMLElement): boolean {
  const el = elementRef;
  if (!el) {
    return false;
  }

  const style = window.getComputedStyle(el);
  const hidden = style.display === 'none';

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed';
  return hidden || parentHidden;
}

let rootFontSize: number;

function getRootFontSize() {
  if (!rootFontSize) {
    const doc = document.documentElement;
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;

    rootFontSize = parseFloat(fontSize);
  }

  return rootFontSize;
}

function convertRem(value: string) {
  // eslint-disable-next-line no-param-reassign
  value = value.replace(/rem/g, '');
  return +value * getRootFontSize();
}

function convertVw(value: string) {
  // eslint-disable-next-line no-param-reassign
  value = value.replace(/vw/g, '');
  return (+value * window.innerWidth) / 100;
}

function convertVh(value: string) {
  // eslint-disable-next-line no-param-reassign
  value = value.replace(/vh/g, '');
  return (+value * window.innerHeight) / 100;
}

export function unitToPx(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  if (inBrowser) {
    if (value.indexOf('rem') !== -1) {
      return convertRem(value);
    }
    if (value.indexOf('vw') !== -1) {
      return convertVw(value);
    }
    if (value.indexOf('vh') !== -1) {
      return convertVh(value);
    }
  }

  return parseFloat(value);
}

export function mergeProps<A, B>(a: A, b: B): B & A;
export function mergeProps<A, B, C>(a: A, b: B, c: C): C & B & A;
// 实现react的defaultProps和props合并
export function mergeProps(...items: any[]) {
  const result = { ...items[0] };
  items.forEach((item) => {
    // eslint-disable-next-line guard-for-in
    for (const key in item) {
      const val = item[key];
      // eslint-disable-next-line no-prototype-builtins
      result[key] = result.hasOwnProperty(key) ? result[key] : val;
    }
  });
  return result;
}
