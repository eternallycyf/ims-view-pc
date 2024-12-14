import { message } from 'antd';
import axios from 'axios';

export function exportFile(url: string, params: any) {
  return axios.get(url, {
    params,
    responseType: 'blob',
  });
}

/**
 * 下载文件
 * @param searchParams
 * @param options
 * @param callback
 */
export const handleDownload = (
  searchParams: any,
  options = { url: '', fileName: '' },
  callback?: () => void,
) => {
  exportFile(options.url, searchParams).then((response: any) => {
    response.blob().then((blob: Blob) => {
      if (response.status === 200) {
        if (window.navigator && (window as any).navigator.msSaveOrOpenBlob) {
          (window as any).navigator.msSaveOrOpenBlob(blob, options.fileName);
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          const aElement = document.createElement('a');
          const fileName = options.fileName;
          aElement.href = blobUrl;
          aElement.download = fileName;
          aElement.click();
          window.URL.revokeObjectURL(blobUrl);
        }
      } else if (callback) callback();
    });
  });
};

export const postDownloadFile = (url: string, fileName: string, data: any = {}) => {
  function download(url: string, data: any) {
    return axios(url, {
      method: 'get',
      responseType: 'blob',
      params: { url },
      data,
    });
  }
  return download(url, data).then((data: any) => {
    if (!data || data?.size == 0) {
      message.error('文件不存在');
      return;
    }
    if (window.navigator && typeof (window as any).navigator.msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(new Blob([data]), fileName);
    } else {
      const url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  });
};
