import { CommonCard } from 'ims-view-pc';
const { Page } = CommonCard;

const App = () => (
  <Page sectionTitleProps={{ tooltip: 'tooltip', extraContent: '右' }} loading title="xx">
    content
  </Page>
);

export default App;
