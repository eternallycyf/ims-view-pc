import { Marker } from 'ims-view-pc';
import React from 'react';

const MyContent = () => {
  const { markerRef, marker } = Marker.hooks.useMarker<HTMLDivElement>();

  React.useEffect(() => {
    if (marker) {
      marker.mark('orl');
    }
  }, [marker]);

  const mark = React.useCallback(() => {
    marker.mark('Hello'); // https://markjs.io#mark
  }, [marker]);

  const unmark = React.useCallback(() => {
    marker.unmark(); // https://markjs.io#unmark
  }, [marker]);

  return (
    <div ref={markerRef}>
      Hello World
      <button type="button" onClick={mark}>
        Mark
      </button>
      &nbsp;
      <button type="button" onClick={unmark}>
        Unmark
      </button>
    </div>
  );
};

export default MyContent;
