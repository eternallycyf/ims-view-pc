import classNames from 'classnames';
import type { CSSProperties, ReactElement } from 'react';
import React, { AriaAttributes } from 'react';

export function pxToNumber(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

export type NativeProps<S extends string = never> = {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
  tabIndex?: number;
} & AriaAttributes;

export function withNativeProps<P extends NativeProps>(props: P, element: ReactElement) {
  const p = {
    ...element.props,
  };
  if (props.className) {
    p.className = classNames(element.props.className, props.className);
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }
  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      p[key] = props[key];
    }
  }
  return React.cloneElement(element, p);
}

export type PropagationEvent = 'click';

const eventToPropRecord: Record<PropagationEvent, string> = {
  click: 'onClick',
};

export function withStopPropagation(events: PropagationEvent[], element: ReactElement) {
  const props: Record<string, any> = { ...element.props };
  for (const key of events) {
    const prop = eventToPropRecord[key];
    props[prop] = function (e: Event) {
      e.stopPropagation();
      element.props[prop]?.(e);
    };
  }
  return React.cloneElement(element, props);
}
