import { ExportButton } from 'ims-view-pc';

const column = [
  { title: '日期', dataIndex: 'date' },
  {
    title: '配送信息',
    children: [
      { title: '姓名', dataIndex: 'name' },
      {
        title: '地址',
        children: [
          { title: '省份', dataIndex: 'province' },
          { title: '市区', dataIndex: 'city' },
          { title: '地址', dataIndex: 'address' },
          { title: '邮编', dataIndex: 'zip' },
        ],
      },
    ],
  },
];

const data = [
  {
    date: '2016-05-03',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-02',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-08',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-06',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-07',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
];

const Demo = () => {
  return (
    <ExportButton<any, any>
      columns={column}
      request={async () =>
        await {
          data: data,
          total: 20,
          success: true,
        }
      }
      fileName="文件"
    />
  );
};

export default Demo;
