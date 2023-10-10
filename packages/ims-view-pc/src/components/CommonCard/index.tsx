import React from 'react';
import AnchorCard from './AnchorCard';
import AnchorLink from './AnchorLink';
import CommonCardComponent from './CommonCard';
import IndexPage from './IndexPage';
import { ICommonCardHandle, ICommonCardProps } from './interface';
import Line from './Line';

const CompoundedCommonCard = React.forwardRef<ICommonCardHandle, ICommonCardProps>(
  CommonCardComponent,
) as <Values = Record<string, unknown>>(
  props: React.PropsWithChildren<ICommonCardProps<Values>> & {
    ref?: React.Ref<ICommonCardHandle<Values>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonCard & {
  IndexPage: typeof IndexPage;
  Line: typeof Line;
  AnchorCard: typeof AnchorCard;
  AnchorLink: typeof AnchorLink;
};

const CommonCard = CompoundedCommonCard as CompoundedComponent;

CommonCard.IndexPage = IndexPage;
CommonCard.Line = Line;
CommonCard.AnchorCard = AnchorCard;
CommonCard.AnchorLink = AnchorLink;

export default CommonCard;
