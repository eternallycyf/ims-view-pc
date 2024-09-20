import React from 'react';
import type { ISearchContext } from './interface';

export const SearchContext = React.createContext<ISearchContext>({} as ISearchContext);
