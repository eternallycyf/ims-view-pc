import { Button } from 'antd';
import { CommonTable, CommonTableRef, IColumnsType } from 'ims-view-pc';
import React from 'react';

interface Record {
  email: string;
  registered: string;
  address: string;
  age: string;
  picture: {
    large: string;
  };
}

interface Params {
  number: number;
}

const columns: IColumnsType<Record> = [
  {
    title: '姓名',
    dataIndex: 'email',
    sorter: true,
    // ellipsisType: 'line',
    // rows: 2,
    ellipsis: true,
  },
  {
    title: '年龄',
    dataIndex: ['picture', 'large'],
    key: 'age',
    sorter: true,
    ellipsis: true,
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

const Demo = () => {
  const ref = React.useRef<CommonTableRef<Record, Params>>();
  const [number, setNumber] = React.useState(0);

  return (
    <div>
      <Button
        onClick={() =>
          ref.current.handleRefreshPage((searchParams, pagination, sorter) => ({
            ...pagination,
            ...sorter,
            ...searchParams,
            xxxxxx: sorter.sorter,
          }))
        }
      >
        refreshPage
      </Button>
      <CommonTable<Record, Params>
        columns={columns}
        ref={ref}
        params={{ number }}
        style={{}}
        className="commonTable"
        // initRequest={false}
        request={(searchParams, sorter) => {
          return new Promise((resolve) => {
            const params = new URLSearchParams(
              Object.entries({ ...sorter, ...searchParams, results: searchParams.pageSize } as any),
            ).toString();
            fetch(`https://randomuser.me/api?${params}`)
              .then((res) => res.json())
              .then(({ results }) => {
                resolve({
                  data: results,
                  total: 200,
                  success: true,
                });
              });
          });
        }}
      />
    </div>
  );
};

export default Demo;
