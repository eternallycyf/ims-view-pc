import { Marker } from 'ims-view-pc';
import React from 'react';
import './index.less';

const MyCustomMarker = () => {
  return (
    <div>
      <Marker mark="Hello" options={{ className: 'custom-marker-1' }}>
        <div>hello</div>
        Hello World - Custom Marker 1
      </Marker>
      <Marker mark="World" options={{ className: 'custom-marker-2' }}>
        Hello World - Custom Marker 2
      </Marker>
    </div>
  );
};

export default MyCustomMarker;
