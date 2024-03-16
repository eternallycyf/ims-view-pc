import type dayjs from 'dayjs';
import { CommonSearch } from 'ims-view-pc';
import React from 'react';

interface Record {
  name: string;
  date: dayjs.Dayjs;
}

const Demo = () => {
  return (
    <>
      <CommonSearch<Record>
        formList={[
          ...new Array(4).fill({
            name: 'name',
            type: 'input',
            label: 'name',
          }),
          ...new Array(10).fill({
            name: 'startDate,endDate',
            type: 'dateRange',
            label: '日期',
          }),
        ]}
        columnNumber={3}
        onSearch={(values) => console.log(values)}
      >
        {(context) => {
          return context.values.name == 'name' ? 'name' : 'no name';
        }}
      </CommonSearch>
      <div>content</div>
    </>
  );
};

export default Demo;
