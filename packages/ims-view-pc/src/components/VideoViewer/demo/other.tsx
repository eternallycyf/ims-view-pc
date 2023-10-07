import { VideoViewer } from 'ims-view-pc';
import React from 'react';

const Cover = () => {
  return (
    <div className="source">
      <div className="block">
        <VideoViewer
          failedMessage="已过期"
          poster="//ysf.qiyukf.net/rygnbxiwcgoudyqnzzpypmtxlwpixigf"
          modalProps={{
            width: 640,
          }}
          videoProps={{
            sources: [
              {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                type: 'video/mp4',
              },
            ],
            download: true,
            downloadSrc: 'http://vjs.zencdn.net/v/oceans.mp4',
            width: 640,
          }}
        />
      </div>
      <div className="block">
        <VideoViewer
          failedMessage="状态描述"
          modalProps={{
            width: 600,
          }}
          videoProps={{
            sources: [
              {
                src: 'http://www.w3school.com.cn/i/movie.ogg',
                type: 'video/ogg',
              },
            ],
            download: true,
            downloadSrc: 'http://www.w3school.com.cn/i/movie.ogg',
            width: 600,
          }}
        />
      </div>
    </div>
  );
};

export default Cover;
