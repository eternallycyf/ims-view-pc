import { CommonCard } from 'ims-view-pc';
import React from 'react';

const AnchorList = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
] as const;

type IAnchorId = (typeof AnchorList)[number]['value'];

const Overview = (props) => {
  return (
    <CommonCard.AnchorCard<IAnchorId> id="detail" btnList={AnchorList} rightChildren="右侧内容">
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id="1" />1
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id="2" />2
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id="3" />3
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id="4" />4
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id="5" />5
        <CommonCard.Line />
      </div>
    </CommonCard.AnchorCard>
  );
};

export default Overview;
