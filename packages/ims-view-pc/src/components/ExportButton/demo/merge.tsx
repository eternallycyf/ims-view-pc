import { ExportButton } from 'ims-view-pc';

const column = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  {
    title: '配送信息',
    children: [
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
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-08',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-08',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-07',
    name: '王小虎',
    age: 20,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
];

const Demo = () => {
  return (
    <ExportButton
      columns={column}
      request={async () =>
        await {
          data: data,
          total: 20,
          success: true,
        }
      }
      renderCell={({ rowIndex, columnIndex }) => {
        if (columnIndex === 0 && rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 2,
          };
        }
        if (rowIndex === 2 && columnIndex === 2) {
          return {
            rowspan: 1,
            colspan: 3,
          };
        }
        if (rowIndex === 0 && columnIndex === 4) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        }
        if (rowIndex === 6 && columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 6,
          };
        }
      }}
      fileName="文件"
    />
  );
};

export default Demo;
