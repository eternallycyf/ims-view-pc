import { ExportButton } from 'ims-view-pc';

const column = [
  { title: 'ID', dataIndex: 'id' },
  { title: '姓名', dataIndex: 'name' },
  { title: '数值1（元）', dataIndex: 'amount1' },
  { title: '数值2（元）', dataIndex: 'amount2' },
  { title: '数值3（元）', dataIndex: 'amount3' },
];

const Demo = () => {
  return (
    <ExportButton<any, any>
      columns={column}
      request={async () =>
        await {
          data: Array.from({ length: 100000 }).map((item) => ({
            id: '12987122',
            name: '王小虎1',
            amount1: '234',
            amount2: '3.2',
            amount3: 10,
          })),
          total: 20,
          success: true,
        }
      }
      fileName="文件"
    />
  );
};

export default Demo;
