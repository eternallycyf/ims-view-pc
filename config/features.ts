import { IFeature } from 'dumi-theme-antd-style';

export const features: IFeature[] = [
  {
    title: '现代化主题风格',
    image: '💠',
    row: 6,
  },
  {
    title: '基于 Ant Design',
    description:
      '使用 antd 作为基础组件库, 兼容antd所有API, 提供了封装的CROD组件, 以及一些常用的组件',
    link: '/components',
    imageType: 'light',
    image:
      'https://gw.alipayobjects.com/zos/hitu-asset/c88e3678-6900-4289-8538-31367c2d30f2/hitu-1609235995955-image.png',
    row: 9,
  },
  {
    title: '亮暗色主题模式一键切换',
    description:
      '本文档基于 antd v5 自定义了亮色与暗色主题算法，默认提供美观易用的亮暗色主题。用户可以根据自己的喜好选择主题模式，在不同的光线环境下都能获得良好的阅读体验。',
    image:
      'https://mdn.alipayobjects.com/huamei_rqvucu/afts/img/A*8KE7T7l39J0AAAAAAAAAAAAADoN6AQ/original',
    imageType: 'primary',
  },
  {
    title: '完全的TypeScript体验',
    description: '所有代码使用TypeScript',
    image:
      'https://mdn.alipayobjects.com/huamei_rqvucu/afts/img/A*1qLNRrRGFsQAAAAAAAAAAAAADoN6AQ/original',
    imageType: 'primary',
    row: 9,
  },
  {
    title: '组件灵活复用',
    description: '采用monorepo结构,所有包皆可单独使用',
    image:
      'https://mdn.alipayobjects.com/huamei_rqvucu/afts/img/A*6sjjRa7lLhAAAAAAAAAAAAAADoN6AQ/original',
    imageType: 'primary',
    row: 8,
  },
  {
    title: '移动端适配良好',
    description:
      '对移动端适配良好，基于 CSSinJS 的灵活样式方案，多套布局实现轻而易举。用户多端操作体验一致且顺滑',
    image: '📱',
    imageType: 'light',
    row: 6,
    hero: true,
  },
];
