import { VideoViewer } from 'ims-view-pc';
import React from 'react';

const Cover = () => {
  return (
    <VideoViewer.Video
      poster="//ysf.qiyukf.net/rygnbxiwcgoudyqnzzpypmtxlwpixigf"
      sources={[
        {
          src: 'http://vjs.zencdn.net/v/oceans.mp4',
          type: 'video/mp4',
        },
      ]}
      download={true}
      downloadSrc="http://vjs.zencdn.net/v/oceans.mp4"
      width={600}
    />
  );
};

export default Cover;
