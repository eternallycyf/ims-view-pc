import {
  GithubOutlined,
  HistoryOutlined,
  IssuesCloseOutlined,
  MediumOutlined,
  TwitterOutlined,
  ZhihuOutlined,
} from '@ant-design/icons';
import React from 'react';

export const footer = [
  {
    title: '相关依赖',
    items: [
      {
        title: 'ims-view-pc',
        url: 'https://ims-view.site/components',
        openExternal: true,
      },
      {
        title: '@ims-view/hooks',
        url: 'https://ims-view.site/hooks',
        openExternal: true,
      },
      {
        title: '@ims-view/utils',
        url: 'https://ims-view.site/utils',
        openExternal: true,
      },
      {
        title: '@ims-view/chart',
        url: 'https://ims-view.site/charts',
        openExternal: true,
      },
      {
        title: 'ims-graph',
        url: 'https://ims-graph.vercel.app/components/graph-chart',
        openExternal: true,
      },
      {
        title: 'ims-IndexedDB',
        url: 'https://ims-indexed-db.vercel.app/components/create-indexed-db-helper',
        openExternal: true,
      },
    ],
  },
  {
    title: '帮助',
    items: [
      {
        title: 'GitHub',
        url: 'https://github.com/eternallycyf/ims-view-pc',
        openExternal: true,
      },
      {
        title: '更新日志',
        url: '/changelog/ims-view-pc',
      },
      {
        title: '讨论',
        url: 'https://github.com/eternallycyf/ims-view-pc/issues',
        openExternal: true,
      },
    ],
  },
  {
    title: '模板',
    items: [
      {
        title: 'ims-monorepo-template',
        description: 'monorepo模板',
        url: 'https://github.com/eternallycyf/ims-monorepo-template',
        openExternal: true,
      },
      {
        title: 'ims-template',
        url: 'https://github.com/eternallycyf/ims-template',
        openExternal: true,
      },
    ],
  },
  {
    title: '更多',
    items: [
      {
        title: 'lrxc-cli',
        url: 'https://github.com/eternallycyf/lrxc-cli',
        openExternal: true,
      },
    ],
  },
];
