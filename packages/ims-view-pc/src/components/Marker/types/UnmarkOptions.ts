import { BaseOptions } from './BaseOptions';

/**
 * @public
 */
export type UnmarkOptions = Partial<Omit<BaseOptions, 'each' | 'filter' | 'noMatch'>>;
