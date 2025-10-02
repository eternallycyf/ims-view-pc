import merge from 'lodash/merge';
import type { Hook } from 'tapable';

/** 插件接口（类式） */
export interface PluginClass<
  T extends Hookable<Config, H>,
  Config,
  H extends Record<string, Hook<any, any>>,
> {
  apply(host: T): void;
}

/** 插件接口（函数式） */
export type PluginFunction<
  T extends Hookable<Config, H>,
  Config,
  H extends Record<string, Hook<any, any>>,
> = (host: T) => void;

/** 通用插件类型 */
export type Plugin<
  T extends Hookable<Config, H>,
  Config,
  H extends Record<string, Hook<any, any>>,
> = PluginClass<T, Config, H> | PluginFunction<T, Config, H>;

/** 工具函数：应用插件 */
export function applyPlugin<
  T extends Hookable<Config, H>,
  Config,
  H extends Record<string, Hook<any, any>>,
>(host: T, plugin: Plugin<T, Config, H>): T {
  if (typeof plugin === 'function') plugin(host);
  else plugin.apply(host);
  return host;
}

/** Hooks 容器类型 */
export type Hooks = Readonly<Record<string, Hook<any, any>>>;

/** 配置类型 */
export interface HookableConfig<T extends HookableConfig<T, H>, H extends Hooks> {
  plugins?: Plugin<Hookable<T, H>, T, H>[];
}

/** 抽象基类 */
export abstract class Hookable<Config extends HookableConfig<Config, H>, H extends Hooks> {
  /** 当前配置 */
  config!: Config;

  /** Hook 集合（子类必须实现） */
  abstract hooks: H;

  /** 已挂载插件 */
  plugins: Plugin<this, Config, H>[] = [];

  /** 初始化配置并挂载插件 */
  setup(config: Partial<Config> = {}) {
    this.config = merge({}, this.getDefaultOptions(), config) as Config;
    this.use(...(this.config.plugins ?? []));
  }

  /** 默认配置 */
  protected getDefaultOptions(): Partial<Config> {
    return { plugins: [] as Plugin<this, Config, H>[] } as Partial<Config>;
  }

  protected getNormalizedConfig(config?: Partial<Config>) {
    return (config ?? { plugins: [] }) as Config;
  }

  /** 挂载插件 */
  use(...plugins: Plugin<this, Config, H>[]): this {
    for (const plugin of plugins) {
      applyPlugin(this, plugin);
      this.plugins.push(plugin);
    }
    return this;
  }

  /** 查找已挂插件 */
  findPlugin(...args: Parameters<typeof this.plugins.find>) {
    return this.plugins.find(...args);
  }
}
