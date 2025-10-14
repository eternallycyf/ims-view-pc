import { TableExtraBtn } from 'ims-view-pc';

const DemoComponent = () => {
  return (
    <TableExtraBtn<{ id: number; name: string }>
      record={{ id: 1, name: '测试' }}
      btnList={[
        {
          type: 'button',
          element: '按钮',
          buttonProps: { size: 'small' },
          onClick: (params, context) => {
            console.log(params, context);
          },
        },
        {
          type: 'link',
          element: '链接',
          typographyProps: { underline: true },
          onClick: (params) => {
            console.log(params);
          },
        },
        {
          type: 'delete',
          element: '删除',
          popconfirmProps: { title: '确认删除吗？' },
          onClick: (params) => {
            console.log(params);
          },
        },
        {
          type: 'custom',
          element: (record) => '测试自定义',
        },
        {
          type: 'button',
          element: '隐藏按钮1',
          buttonProps: { size: 'small' },
          visible: (record) => {
            return record.id === 1;
          },
        },
        {
          type: 'button',
          element: '隐藏按钮2',
          buttonProps: { size: 'small' },
          visible: (record) => {
            return record.id === 2;
          },
        },
      ]}
      maxShowMoreCount={4}
      emptyText={<div>No buttons available</div>}
    />
  );
};

export default DemoComponent;
