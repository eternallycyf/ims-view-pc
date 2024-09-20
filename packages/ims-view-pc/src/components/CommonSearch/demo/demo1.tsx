import { Col, Form, Input } from 'antd';
import type dayjs from 'dayjs';
import { CommonSearch } from 'ims-view-pc';

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
            label: 'namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename',
          }),
          ...new Array(10).fill({
            name: 'startDate,endDate',
            type: 'dateRange',
            label: '日期',
          }),
        ]}
        onSearch={(values) => console.log(values)}
      >
        <Col span={12}>
          <Form.Item name="aaa" label="aa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
      </CommonSearch>
    </>
  );
};

export default Demo;
