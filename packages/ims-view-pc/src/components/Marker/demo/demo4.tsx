import { Marker } from 'ims-view-pc';
import React from 'react';
const { RangesMarker } = Marker;

const blue = { color: 'blue' };
export const RangesExample = () => {
  return (
    <div>
      <h2>Single Range</h2>
      <RangesMarker
        style={blue}
        mark={[
          {
            length: 5,
            start: 3,
          },
        ]}
      >
        <h3>0123456789</h3>
      </RangesMarker>
      <h2>Multiple Ranges</h2>
      <RangesMarker
        style={blue}
        mark={[
          {
            length: 5,
            start: 3,
          },
          {
            length: 15,
            start: 11,
          },
        ]}
      >
        <h3>0123456789 123456789 123456789 123456789</h3>
      </RangesMarker>
      <h2>With Options</h2>
      <RangesMarker
        mark={[
          {
            length: 5,
            start: 3,
          },
          {
            length: 15,
            start: 11,
          },
        ]}
        options={{
          className: 'custom-marker-1',
        }}
      >
        <h3 style={blue}>0123456789 123456789 123456789 123456789</h3>
      </RangesMarker>
    </div>
  );
};

export default RangesExample;
