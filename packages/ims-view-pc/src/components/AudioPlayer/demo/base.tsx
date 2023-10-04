import { AudioPlayer } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: 400 }}>
      <AudioPlayer
        src="//ysf.qiyukf.net/26952087D69B79839F17040A5DC2E775.wav"
        title="这是一个demo"
      />
    </div>
  );
};

export default App;
