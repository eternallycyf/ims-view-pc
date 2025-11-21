import {
  type ProDescriptionsActionType,
  type ProDescriptionsItemProps,
} from '@ant-design/pro-descriptions';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { CommonCard, CustomDescriptions, CustomTooltip } from 'ims-view-pc';
import { useRef } from 'react';

interface ResponseData {
  info: {
    id: string;
    text: string;
    money: number;
    percent: number;
    option: string;
    remoteOption: string;
    progress: number;
    date: number;
    dateRange: [number, number];
    time: number;
    code: string;
    jsonCode: string;
  };
}

const Demo = () => {
  const actionRef = useRef<ProDescriptionsActionType>(null!);

  // 用 columns 类型表示所有字段
  const columns: ProDescriptionsItemProps<ResponseData>[] = [
    {
      title: '操作',
      valueType: 'option',
      render: () => [
        <Button key="primary" type="primary">
          提交
        </Button>,
      ],
    },
    {
      title: '文本',
      dataIndex: ['info', 'text'],
      span: 2,
      valueType: 'text',
      ellipsis: true,
      renderText: (_) => _ + _,
    },
    {
      title: '文本',
      dataIndex: ['info', 'text'],
      span: 2,
      valueType: 'text',
      render: (_, record) => <CustomTooltip.Paragraph rows={2} content={record.info.text} />,
    },
    {
      title: '金额',
      dataIndex: ['info', 'money'],
      valueType: 'money',
      tooltip: '仅供参考，以实际为准',
    },
    {
      title: '百分比',
      dataIndex: ['info', 'percent'],
      valueType: 'percent',
    },
    {
      title: '选择框',
      dataIndex: ['info', 'option'],
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: { text: '未解决', status: 'Error' },
        closed: { text: '已解决', status: 'Success' },
        processing: { text: '解决中', status: 'Processing' },
      },
    },
    {
      title: '远程选择框',
      dataIndex: ['info', 'remoteOption'],
      request: async () => [
        { label: '全部', value: 'all' },
        { label: '未解决', value: 'open' },
        { label: '已解决', value: 'closed' },
        { label: '解决中', value: 'processing' },
      ],
    },
    {
      title: '进度条',
      dataIndex: ['info', 'progress'],
      valueType: 'progress',
    },
    {
      title: '日期时间',
      dataIndex: ['info', 'date'],
      valueType: 'dateTime',
    },
    {
      title: '日期',
      dataIndex: ['info', 'date'],
      valueType: 'date',
    },
    {
      title: '日期区间',
      dataIndex: ['info', 'dateRange'],
      valueType: 'dateTimeRange',
    },
    {
      title: '时间',
      dataIndex: ['info', 'time'],
      valueType: 'time',
    },
    {
      title: '代码块',
      dataIndex: ['info', 'code'],
      valueType: 'code',
    },
    {
      title: 'JSON 代码块',
      dataIndex: ['info', 'jsonCode'],
      valueType: 'jsonCode',
    },
  ];

  return (
    <CommonCard.Page>
      <CustomDescriptions<ResponseData>
        title="详情表格"
        actionRef={actionRef}
        column={2}
        labelStyle={{ minWidth: 100, justifyContent: 'end' }}
        request={async () => ({
          success: true,
          data: {
            info: {
              id: '这是一段文本',
              text: '这是一段很长很长超级超级长的无意义说明文本并且重复了很多没有意义的词语，就是为了让它变得很长很长超级超级长这是一段很长很长超级超级长的无意义说明文本并且重复了很多没有意义的词语，就是为了让它变得很长很长超级超级长这是一段很长很长超级超级长的无意义说明文本并且重复了很多没有意义的词语，就是为了让它变得很长很长超级超级长',
              money: 12121,
              percent: 100,
              option: 'open',
              remoteOption: 'closed',
              progress: 40,
              date: dayjs().valueOf(),
              dateRange: [dayjs().add(-1, 'd').valueOf(), dayjs().valueOf()],
              time: dayjs().valueOf(),
              code: `
yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.
            `,
              jsonCode: `{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["**/src", "**/docs", "scripts", "**/demo", ".eslintrc.js"]
}
`,
            },
          },
        })}
        columns={columns}
      />
    </CommonCard.Page>
  );
};

export default Demo;
