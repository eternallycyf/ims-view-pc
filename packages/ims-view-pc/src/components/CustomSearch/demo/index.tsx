import { Table } from 'antd';
import {
  CommonSearch,
  CommonTable,
  CustomForm,
  useBaseComponent,
  type IColumnsType,
} from 'ims-view-pc';
import { useEffect } from 'react';

interface SearchFormValues {
  fileName: string;
  fileType: string[];
  fileStatus: string[];
}

export interface Record {
  email: string;
  registered: string;
  address: string;
  age: string;
  gender: string;
  phone: string;
  index: string;
}

export type RestParams = {
  customParams?: '2';
};

const App = () => {
  const { CustomSearchParams, formValues, setFormValues, TableHeight } =
    CustomForm.useCustomSearch<SearchFormValues>({
      className: 'document-searchForm',
      initValues: {
        fileName: '',
        fileType: [],
      },
    });

  const columns: IColumnsType<Record> = [
    {
      title: '索引',
      dataIndex: 'index',
      width: 50,
    },
    {
      title: '姓名',
      dataIndex: 'email',
      sorter: true,
      width: 50,
      ellipsisType: 'line',
      rows: 2,
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'gender',
      key: 'age',
      sorter: true,
      width: 50,
      ellipsis: true,
      ...CustomForm.Utils.getColumnSearchItem<SearchFormValues, {}>(
        {
          type: 'select',
          name: 'fileType',
          controlProps: {
            placeholder: '搜索文件类型',
            mode: 'multiple',
            style: {
              width: 246,
            },
            maxTagCount: 'responsive',
          },
          dict: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
        },
        formValues?.fileName,
      ),
    },
    {
      title: '住址',
      dataIndex: 'email',
      key: 'email',
      width: 50,
    },
  ];

  return (
    <div>
      <CustomForm.CustomSearch<SearchFormValues, {}>
        {...CustomSearchParams}
        enabledColumnsSearch
        rowProps={{
          className: '',
          gutter: [16, 16],
        }}
        formList={[
          {
            type: 'input',
            name: 'fileName',
            col: 24,
            controlProps: {
              placeholder: '搜索文件名称',
              style: {
                width: 274,
              },
            },
          },
        ]}
      >
        <div>
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
        </div>
        <Table columns={columns} />
      </CustomForm.CustomSearch>
    </div>
  );
};

export default App;
