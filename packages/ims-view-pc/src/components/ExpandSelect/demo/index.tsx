import { ExpandSelect } from 'ims-view-pc';

const options = [
  { label: 'jack', value: '1' },
  { label: 'lucy', value: '2' },
  { label: 'Yiminghe', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
];

const App = () => {
  return <ExpandSelect options={options} />;
};

export default App;
