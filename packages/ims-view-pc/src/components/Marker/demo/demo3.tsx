import { Marker } from 'ims-view-pc';
import React from 'react';

const MarkerExamples = () => {
  return (
    <div>
      <h2>Single String</h2>
      <Marker mark="Ullamco qui deserunt ut reprehenderit">
        Cillum proident eu eiusmod incididunt pariatur. Ullamco qui deserunt ut reprehenderit
        cupidatat cupidatat nisi non occaecat non commodo. Magna incididunt eu laboris laboris
        labore.
      </Marker>
      <h2>Multiple Strings</h2>
      <Marker mark={['eiusmod incididunt', 'commodo. Magna']}>
        Cillum proident eu eiusmod incididunt pariatur. Ullamco qui deserunt ut reprehenderit
        cupidatat cupidatat nisi non occaecat non commodo. Magna incididunt eu laboris laboris
        labore.{' '}
      </Marker>
      <h2>Configure Wrapper Element</h2>
      <Marker as="section" mark="Ullamco qui deserunt ut reprehenderit">
        Cillum proident eu eiusmod incididunt pariatur. Ullamco qui deserunt ut reprehenderit
        cupidatat cupidatat nisi non occaecat non commodo. Magna incididunt eu laboris laboris
        labore.{' '}
      </Marker>
      <h2>With Options</h2>
      <Marker
        as="section"
        mark="nisi non occaecat"
        options={{
          className: 'custom-marker-1',
        }}
      >
        Cillum proident eu eiusmod incididunt pariatur. Ullamco qui deserunt ut reprehenderit
        cupidatat cupidatat nisi non occaecat non commodo. Magna incididunt eu laboris laboris
        labore.{' '}
      </Marker>
    </div>
  );
};

export default MarkerExamples;
