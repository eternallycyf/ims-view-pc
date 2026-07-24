export enum StatusCode {
  OK = 0,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 999,
}

export class ResponseEntity<T> {
  static default: {
    code: ResponseEntity<unknown>['code'];
    data: ResponseEntity<unknown>['data'];
    msg: ResponseEntity<unknown>['msg'];
    retriable: ResponseEntity<unknown>['retriable'];
  } = Object.freeze({
    code: StatusCode.OK,
    data: undefined,
    msg: undefined,
    retriable: undefined,
  });

  static of<T>(...args: ConstructorParameters<typeof ResponseEntity<T>>) {
    return new ResponseEntity(...args);
  }

  static ofSuccess<T>(data?: T, code: number = StatusCode.OK) {
    return new ResponseEntity(code, data);
  }

  static ofSuccessWithMsg<T>(data: T, msg?: string, code: number = StatusCode.OK) {
    return new ResponseEntity(code, data, msg);
  }

  static ofFailure(err: unknown, code: number = 1) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Server Error';
    return new ResponseEntity(code, null, message);
  }

  static from<T>(object?: Record<string, unknown>) {
    return this.of<T>(
      (object?.code as number) ?? this.default.code,
      object?.data as T,
      object?.msg as string | undefined,
      object?.retriable as boolean | undefined,
    );
  }

  code: number;
  msg?: string;
  data?: T;
  retriable?: boolean;

  constructor(
    code: ResponseEntity<T>['code'],
    data?: ResponseEntity<T>['data'],
    msg?: ResponseEntity<T>['msg'],
    retriable?: ResponseEntity<T>['retriable'],
  ) {
    this.code = code;
    this.data = data;
    this.msg = msg;
    this.retriable = retriable;
  }

  getCode() {
    return this.code;
  }

  setCode(code: ResponseEntity<T>['code']) {
    this.code = code;
    return this;
  }

  getData() {
    return this.data;
  }

  setData(data: ResponseEntity<T>['data']) {
    this.data = data;
    return this;
  }

  getMsg() {
    return this.msg;
  }

  setMsg(msg: ResponseEntity<T>['msg']) {
    this.msg = msg;
    return this;
  }

  getRetriable() {
    return this.retriable;
  }

  setRetriable(retriable: ResponseEntity<T>['retriable']) {
    this.retriable = retriable;
    return this;
  }
}
