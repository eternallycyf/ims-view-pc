import { CustomForm } from 'ims-view-pc';

interface SearchFormValues {
  fileName: string;
  fileType: string[];
  fileStatus: string[];
}

const App = () => {
  const { CustomSearchParams, formValues, setFormValues, TableHeight } =
    CustomForm.useCustomSearch<SearchFormValues>({
      className: 'document-searchForm',
      initValues: {
        fileName: '',
        fileType: [],
      },
    });

  return (
    <div>
      <CustomForm.CustomSearch<SearchFormValues, {}>
        {...CustomSearchParams}
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
          {
            type: 'select',
            name: 'fileType',
            col: 24,
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
        ]}
      />
      <div>
        <pre>{JSON.stringify(formValues, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
