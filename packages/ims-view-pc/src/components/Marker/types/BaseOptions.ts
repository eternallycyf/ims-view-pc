/**
 * @public
 */
export type Accuracy = 'partially' | 'complimentary' | 'exactly';

/**
 * @public
 */
export type WildCards = 'disabled' | 'enabled' | 'withSpaces';

export interface BaseOptions {
  /**
   * A class name that will be appended to element
   * @defaultValue `""`
   */
  className: string;
  /**
   * A callback for each marked element. Receives the marked DOM element as a parameter
   */
  each: (_markedDomElement: Element) => void;
  /** HTML element to wrap matches, e.g. `span`,
   * @defaultValue `mark`
   */
  element: string;
  /**
   * An array with exclusion selectors. Matches inside these elements will be ignored. Example: "filter": ["h1", ".ignore"]
   * @defaultValue `[]`
   */
  exclude: string[];
  /**
   * Whether to search also inside iframes. If you don't have permissions to some iframes (e.g. because they have a [different origin](https://en.wikipedia.org/wiki/Same-origin_policy)) they will be silently skipped. If you don't want to search inside specific iframes (e.g. facebook share), you can pass an `exclude` selector that matches these iframes
   * @defaultValue `false`
   */
  iframes: boolean;
  /**
   * The maximum ms to wait for a `load` event before skipping an iframe. Especially important when there's no internet connection or a browser "offline" mode is enabled and an iframe has an online `src` – then the `load` event is never fired
   * @defaultValue `5000`
   */
  iframesTimeout: number;
  /**
   * A callback to filter or limit matches. It will be called for each match and receives the following parameters:

    1. The text node which includes the match
    1. The term that has been found
    1. A counter indicating the total number of all marks at the time of the function call
    1. A counter indicating the number of marks for the term

The function must return false if the mark should be stopped, otherwise true
   */
  filter: (textNode: Element, term: string, numberOfMarks: number) => void;
  /**
   * A callback function that will be called when there are no matches. Receives the not found term as a parameter
   */
  noMatch: (term: string | string[]) => void;
  /**
   * A callback for each marked element. Receives the marked DOM element as a parameter
   */
  done: (el: Element) => void;
  /**
   * Set this option to true if you want to log messages
   * @defaultValue `false`
   */
  debug: boolean;
  /**
   * Log messages to a specific object (only if `debug` is true)
   * @defaultValue `console`
   */
  log: Console;
}
