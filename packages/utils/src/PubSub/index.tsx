type ValueOf<T> = T[keyof T];

class PubSub<Events extends Record<string, (...arg: Args[]) => any>, Args extends any> {
  public handlers: Partial<Record<keyof Events, ValueOf<Events>[]>>;

  constructor() {
    this.handlers = {};
  }

  static create = <Events extends Record<string, (...arg: Args[]) => any>, Args extends any>() =>
    new PubSub<Events, Args>();

  on<K extends keyof Events>(eventType: K, handle: Events[K]) {
    if (typeof handle !== 'function') throw new Error('handle must be a function');
    if (!this.handlers.hasOwnProperty(eventType)) this.handlers[eventType] = [];
    this.handlers[eventType]!.push(handle);
    return this;
  }

  emit<K extends keyof Events>(eventType: K, ...args: Parameters<Events[K]>) {
    if (!this.handlers.hasOwnProperty(eventType)) throw new Error('eventType is not exist');
    this.handlers[eventType]!.forEach((item: any) => item.apply(null, args));
    return this;
  }

  off<K extends keyof Events>(eventType: K, handle: Events[K]) {
    if (!this.handlers.hasOwnProperty(eventType)) throw new Error('eventType is not exist');
    if (typeof handle !== 'function') throw new Error('handle must be a function');
    this.handlers[eventType]!.forEach(
      (item: any, key: number, arr: any[]) => item === handle && arr.splice(key, 1),
    );
    return this;
  }
}

export const createPubSub = <
  Events extends Record<string, (...arg: Args[]) => any>,
  Args extends any,
>() => PubSub.create<Events, Args>();

export default new PubSub();
