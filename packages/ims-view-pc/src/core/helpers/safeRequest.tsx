import { applyAwait } from '@ims-view/utils';
import { message } from 'antd';
import axios, { type AxiosResponse } from 'axios';

export enum SafeRequestErrorEnum {
  CALCEL = '请求已取消',
  NETWORK_ERROR = 'Network Error',
}

// 捕捉 请求取消的情况
export const lazyRequest = <T extends any>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<AxiosResponse<ApiResponse<T>>> => {
  return new Promise((resolve, reject) => {
    fn().then(resolve).catch(reject);
  });
};

export interface SafeRequestOptions {
  showError?: boolean;
  finallyCallback?: Function;
  defaultMsg?: string;
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 封装 axios 请求，保证错误统一处理，返回固定格式 [err, data]
 * 并支持 finally 回调（在 options 中）
 *
 * 功能：
 * 1. 成功返回 [null, data]
 * 2. 失败返回 [Error, undefined]，err.message 中包含最终可显示的错误信息
 * 3. 可选自动 message.error 提示
 * 4. 支持 finally 回调
 *
 * @param promise - axios 请求 Promise
 * @param options - 控制参数（showError, finallyCallback）
 * @returns [Error | null, T | undefined]
 *
 * @example
 * // 默认自动提示错误 + finally
 * setLoading(true)
 * const [err, res] = await safeRequest(
 *   axios.post('/api/xxx', { id: fileId }),
 *   {
 *     finallyCallback: () => setLoading(false)
 *   }
 * )
 * if (err) {
 *   console.log('错误信息:', err.message)
 *   return
 * }
 * message.success('删除成功')
 *
 * @example
 * // 禁用自动提示错误
 * setLoading(true)
 * const [err, res] = await safeRequest(
 *   axios.post('/api/xxx', { id: fileId }),
 *   {
 *     showError: false,
 *     finallyCallback: () => setLoading(false)
 *   }
 * )
 * if (err) {
 *   message.error(err.message)
 *   return
 * }
 * message.success('删除成功')
 */
export async function safeRequest<T = any>(
  promiseOrFactory:
    | Promise<AxiosResponse<ApiResponse<T>>>
    | (() => Promise<AxiosResponse<ApiResponse<T>>>),
  options?: SafeRequestOptions,
): Promise<[Error, undefined] | [null, ApiResponse<T>]> {
  const { showError = true, finallyCallback, defaultMsg = '操作失败，请稍后重试' } = options || {};

  const promise = typeof promiseOrFactory === 'function' ? promiseOrFactory() : promiseOrFactory;

  try {
    const [err, res] = (await applyAwait(promise)) as
      | [Error, undefined]
      | [null, AxiosResponse<ApiResponse<T>>];

    if (err instanceof Error) {
      let finalMsg = defaultMsg;

      if ((err as any).code === 'ERR_CANCELED') {
        return [Object.assign(err, { message: '请求已取消' }), undefined];
      }

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.msg) {
          finalMsg = err.response.data.msg;
        } else if (!err.response || err.message === 'Network Error') {
          finalMsg = '网络异常，请稍后重试';
        } else if (err.message) {
          finalMsg = err.message;
        }
      } else if (err.message) {
        finalMsg = err.message;
      }

      const safeErr = Object.assign(err, { message: finalMsg });

      if (showError) {
        message.error(finalMsg);
      }

      return [safeErr, undefined];
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return [null, res?.data!];
  } finally {
    finallyCallback?.();
  }
}
