import { VideoViewer } from 'ims-view-pc';
import React from 'react';

const Cover = () => {
  return (
    <VideoViewer.Video
      sources={[
        {
          src: 'http://www.w3school.com.cn/i/movie.ogg',
          type: 'video/ogg',
        },
      ]}
      download={true}
      downloadSrc="http://www.w3school.com.cn/i/movie.ogg"
      width={600}
    />
  );
};

export default Cover;
