import { CustomForm, ExpandSelect } from 'ims-view-pc';

const options = [
  { label: 'jack', value: 'jack' },
  { label: 'lucy', value: 'lucy' },
  { label: 'Yiminghe', value: 'Yiminghe' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
];

const App = () => {
  return (
    <CustomForm
      onFinish={(values) => {
        console.log(values);
      }}
      modalType={CustomForm.ModalTypeEnum.normal}
      formList={[
        {
          label: 'ExpandSelect',
          name: 'expandSelect',
          type: 'custom',
          col: 24,
          Component: (props) => {
            return (
              <ExpandSelect
                value={props?.value}
                onChange={props?.onChange}
                options={options}
                style={{ width: 200 }}
              />
            );
          },
        },
      ]}
    />
  );
};

export default App;
