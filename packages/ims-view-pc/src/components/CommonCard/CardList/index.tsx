import React from 'react';
import CommonCardList from './CardList';
import { ICardListHandle, ICardListProps } from './interface';

const CompoundedCommonCardList = React.forwardRef<ICardListHandle, ICardListProps>(
  CommonCardList,
) as <Values = Record<string, unknown>>(
  props: React.PropsWithChildren<ICardListProps<Values>> & {
    ref?: React.Ref<ICardListHandle<Values>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonCardList;

const CardList = CompoundedCommonCardList as CompoundedComponent;

export default CardList;
