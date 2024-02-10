import React from 'react';
import AnchorCard from './AnchorCard';
import AnchorLink from './AnchorLink';
import CardList from './CardList';
import CommonCardComponent from './CommonCard';
import IndexPage from './IndexPage';
import Line from './Line';
import Page from './Page';
import StickyPage from './StickyPage';
import { ICommonCardHandle, ICommonCardProps } from './interface';

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
  CardList: typeof CardList;
  Page: typeof Page;
  StickyPage: typeof StickyPage;
};

const CommonCard = CompoundedCommonCard as CompoundedComponent;

CommonCard.IndexPage = IndexPage;
CommonCard.Line = Line;
CommonCard.AnchorCard = AnchorCard;
CommonCard.AnchorLink = AnchorLink;
CommonCard.CardList = CardList;
CommonCard.Page = Page;
CommonCard.StickyPage = StickyPage;

export default CommonCard;
