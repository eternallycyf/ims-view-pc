import { ExportButton } from 'ims-view-pc';

const column = [
  { title: '日期', dataIndex: 'date' },
  { title: '姓名', dataIndex: 'name' },
  { title: '地址', dataIndex: 'address' },
];

const data = [
  {
    id: '1',
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    children: [
      {
        id: '1-1',
        date: '2016-05-02',
        name: '王小虎-1',
        address: '上海市普陀区金沙江路 1518 弄',
      },
      {
        id: '1-2',
        date: '2016-05-02',
        name: '王小虎-2',
        address: '上海市普陀区金沙江路 1518 弄',
        children: [
          {
            id: '1-2-1',
            date: '2016-05-02',
            name: '王小虎-1',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            id: '1-2-2',
            date: '2016-05-02',
            name: '王小虎-2',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            id: '1-2-3',
            date: '2016-05-02',
            name: '王小虎-2',
            address: '上海市普陀区金沙江路 1518 弄',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
  },
  {
    id: '3',
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
    children: [
      {
        id: '3-1',
        date: '2016-05-02',
        name: '王小虎-1',
        address: '上海市普陀区金沙江路 1518 弄',
      },
      {
        id: '3-2',
        date: '2016-05-02',
        name: '王小虎-2',
        address: '上海市普陀区金沙江路 1518 弄',
      },
      {
        id: '3-3',
        date: '2016-05-02',
        name: '王小虎-2',
        address: '上海市普陀区金沙江路 1518 弄',
      },
    ],
  },
  {
    id: '4',
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
  },
];

const Demo = () => {
  return (
    <ExportButton
      columns={column}
      treeConfig={{
        treeNode: true,
        treeField: 'name',
        indentSize: 20,
      }}
      sheetName="sheet1"
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
