import { AudioPlayer } from 'ims-view-pc';
import React from 'react';

const App = () => {
  return (
    <div style={{ width: 400 }}>
      <AudioPlayer
        src="//ysf.qiyukf.net/6DB6A44FF040D96551EC00507730FC4D.wav"
        download={true}
        size={'small'}
        rateOptions={{
          decimal: 1,
          range: [2, 1, 0.5],
        }}
      />
    </div>
  );
};

export default App;
