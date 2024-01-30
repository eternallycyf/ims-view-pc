import { Marker as CommonMarker } from './Marker';
import { RangesMarker } from './RangesMarker';
import { RegExpMarker } from './RegExpMarker';
import { treeifyHeaders } from './treeifyHeaders';
import { useMarker } from './useMarker';

type CompoundedComponent = typeof CommonMarker & {
  RangesMarker: typeof RangesMarker;
  RegExpMarker: typeof RegExpMarker;
  hooks: {
    useMarker: typeof useMarker;
  };
  treeifyHeaders: typeof treeifyHeaders;
};

const Marker = CommonMarker as CompoundedComponent;

Marker.RangesMarker = RangesMarker;
Marker.RegExpMarker = RegExpMarker;
Marker.hooks = {
  useMarker,
};
Marker.treeifyHeaders = treeifyHeaders;

export default Marker;
