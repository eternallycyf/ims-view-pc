import { notification } from 'antd';
import React, { useEffect } from 'react';

const isChrome = () => {
  const userAgentStr =
    (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || '';
  if (!userAgentStr.match(/chrome/g)) {
    return false;
  }
  const markList = [
    'uBrowser', // UC
    'taobrowser', // 淘宝
    'lbbrowser', // 猎豹
    'qqbrowser', // QQ
    'maxthon', // 遨游
    'baidubrowser', // 百度
    'edge', // edge
    'edg',
  ];
  const isChromeAgent = !markList.some((item) => userAgentStr.indexOf(item) >= 0);
  if (!isChromeAgent) return false;
  const mimeTypeList = [
    'application/vnd.chromium.remoting-viewer', // 360
    'application/sogou-native-widget-plugin', // 搜狗
  ];
  const mimeTypes = navigator.mimeTypes || [];
  for (let i = 0; i < mimeTypes.length; i++) {
    const type = (mimeTypes[i] && mimeTypes[i].type && mimeTypes[i].type.toLowerCase()) || '';
    if (mimeTypeList.indexOf(type) > -1) {
      return false;
    }
  }
  return true;
};

const useChromeCheck = () => {
  useEffect(() => {
    if (!isChrome()) {
      const startElement = React.createElement(
        'span',
        null,
        '当前不是Chrome浏览器，可能会出现兼容性问题，建议使用Chrome浏览器访问，或者在',
      );
      const aElement = React.createElement(
        'a',
        {
          href: 'https://www.google.cn/intl/zh-CN/chrome/',
          style: { color: '#5596E3', textDecoration: 'underline' },
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        '此处',
      );
      const endElement = React.createElement('span', null, '下载Chrome浏览器');
      const divElement = React.createElement(
        'div',
        { id: 'chrome-listen' },
        startElement,
        aElement,
        endElement,
      );
      notification.warning({
        message: '浏览器兼容性提示',
        duration: null,
        description: divElement,
      });
    }
    return () => {
      notification.destroy();
    };
  }, []);
};

export default useChromeCheck;
