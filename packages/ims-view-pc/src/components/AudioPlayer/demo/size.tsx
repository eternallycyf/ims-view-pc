import { Radio } from 'antd';
import { AudioPlayer } from 'ims-view-pc';
import React from 'react';

const App = () => {
  const [size, setSize] = React.useState<'default' | 'small'>('default');

  const handleSizeChange = (e: any) => {
    setSize(e.target.value);
  };

  return (
    <div style={{ width: 400 }}>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio.Button value="default">Default</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <AudioPlayer
        size={size}
        src="//ysf.qiyukf.net/26952087D69B79839F17040A5DC2E775.wav"
        title="这是一个demo"
      />
    </div>
  );
};

export default App;
