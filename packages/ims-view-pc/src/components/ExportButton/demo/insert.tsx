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
  const params: any = {
    setInsertHeader: ({ sheetIndex }) => {
      console.log(sheetIndex);
      return {
        cells: [
          {
            row: 0,
            col: 0,
            rowspan: 2, // 占2行
            colspan: 3, // 占3列
            text: '我是插入到Excel头部的信息',
          },
          {
            row: 2,
            col: 0,
            rowspan: 3,
            colspan: 3,
            text: '我也是插入到Excel头部的信息',
            style: {
              font: {
                size: 16, // 字体大小
                bold: true, // 字体加粗
                italic: true, // 字体倾斜
                color: { argb: 'FFFF0000' }, // 字体颜色
              },
            },
          },
        ],
      };
    },
    setInsertFooter: ({ sheetIndex }) => {
      console.log(sheetIndex);
      return {
        cells: [
          {
            row: 0, // 内部会自动推断现在的位置，我们只需要考虑从尾部开始的位置即可
            col: 0,
            rowspan: 2, // 占2行
            colspan: 3, // 占3列
            text: '我是插入到Excel尾部的信息',
          },
          {
            row: 2,
            col: 0,
            rowspan: 3,
            colspan: 3,
            text: '我也是插入到Excel尾部的信息',
            style: {
              font: {
                size: 16, // 字体大小
                bold: true, // 字体加粗
                italic: true, // 字体倾斜
                color: { argb: 'FFFF0000' }, // 字体颜色
              },
            },
          },
        ],
      };
    },
  };
  return (
    <ExportButton<any, any>
      columns={column}
      {...params}
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
