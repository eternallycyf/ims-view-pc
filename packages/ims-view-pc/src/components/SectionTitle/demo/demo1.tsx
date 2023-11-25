import { SectionTitle } from 'ims-view-pc';

const App = () => {
  return (
    <div style={{ position: 'relative' }}>
      <SectionTitle
        title="标题"
        tooltip="这是一个tooltip这是一个tooltip这是一个tooltip这是一个tooltip这是一个tooltip这是一个tooltip"
        extraContent="右侧"
      >
        content
      </SectionTitle>
    </div>
  );
};

export default App;
