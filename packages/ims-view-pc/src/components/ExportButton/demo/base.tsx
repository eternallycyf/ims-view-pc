import { ExportButton } from 'ims-view-pc';

const column = [
  { title: '日期', dataIndex: 'date' },
  { title: '姓名', dataIndex: 'name' },
  { title: '地址', dataIndex: 'address' },
];

const data = [
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
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
