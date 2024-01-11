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
  const params = {
    setCellStyle({ data, columnIndex, rowIndex, type }) {
      console.log({ data, columnIndex, rowIndex, type });
      if (type === 'main' && columnIndex === 2) {
        return {
          font: {
            size: 16, // 字体大小
            bold: true, // 字体加粗
            italic: true, // 字体倾斜
            color: { argb: 'FFFF0000' },
          },
          // fill: {
          //   type: "pattern",
          //   pattern: "solid",
          //   fgColor: { argb: "FF0000FF" }, // 填充背景颜色
          // },
        };
      }
    },
    setCellFormat: ({ rowIndex, columnIndex, type }) => {
      if (type === 'header' && rowIndex === 0 && columnIndex === 0) {
        return {
          text: '我是超链接',
          hyperlink: 'http://www.baidu.com',
          tooltip: '小郑同学的开发路',
        };
      }
      if (rowIndex === 1 && columnIndex === 0) {
        return {
          numFmt: 'yyyy-mm-dd',
        };
      }
    },
    sheetName: '~~~ 我有名字了 ~~~', // sheet名称
    setSheetStyle: ({ sheetIndex }) => {
      console.log(sheetIndex, 'sheetIndex');
      return {
        properties: { tabColor: { argb: 'FFC0000' } }, // 创建带有红色标签颜色的工作表
        views: [
          {
            state: 'frozen',
            xSplit: 1, // 固定1列(同表格固定列)
            ySplit: 1, // 固定1行(同表格固定行)
          },
        ],
      };
    },
  };
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
      {...(params as any)}
      setColumnStyle={({ columnIndex }) => {
        if (columnIndex === 2) {
          return { width: 40, style: { font: { bold: true } } };
        }
      }}
      setRowStyle={({ data, columnIndex, rowIndex, type }) => {
        console.log({ data, columnIndex, rowIndex, type });
        if (type === 'main') {
          return {
            height: 40,
          };
        }
      }}
      fileName="文件"
    />
  );
};

export default Demo;
