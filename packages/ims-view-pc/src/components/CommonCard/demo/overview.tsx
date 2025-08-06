import { CommonCard } from 'ims-view-pc';
import React from 'react';

const enum AnchorEnum {
  FIRST = '1',
  SECOND = '2',
  THIRD = '3',
  FOURTH = '4',
  FIFTH = '5',
}

const AnchorList = [
  {
    label: '锚点1',
    value: AnchorEnum.FIRST,
  },
  {
    label: '锚点2',
    value: AnchorEnum.SECOND,
  },
  {
    label: '锚点3',
    value: AnchorEnum.THIRD,
  },
  {
    label: '锚点4',
    value: AnchorEnum.FOURTH,
  },
  {
    label: '锚点5',
    value: AnchorEnum.FIFTH,
  },
] as const;

type IAnchorId = `${AnchorEnum}`;

const Overview = (props) => {
  return (
    <CommonCard.AnchorCard<IAnchorId> id="detail" btnList={AnchorList} rightChildren="右侧内容">
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id={AnchorEnum.FIRST} />1
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id={AnchorEnum.SECOND} />2
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id={AnchorEnum.THIRD} />3
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id={AnchorEnum.FOURTH} />4
        <CommonCard.Line />
      </div>
      <div style={{ height: 400 }}>
        <CommonCard.AnchorLink<IAnchorId> id={AnchorEnum.FIFTH} />5
        <CommonCard.Line />
      </div>
    </CommonCard.AnchorCard>
  );
};

export default Overview;
