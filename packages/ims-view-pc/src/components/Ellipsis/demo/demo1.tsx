import { Ellipsis } from 'ims-view-pc';
import React from 'react';
export default () => {
  const article =
    'There were injuries alleged in three cases in 2015, and a fourth incident in September, according to the safety recall report. After meeting with US regulators in October, the firm decided to issue a voluntary recall.';
  return <Ellipsis length={100}>{article}</Ellipsis>;
};
