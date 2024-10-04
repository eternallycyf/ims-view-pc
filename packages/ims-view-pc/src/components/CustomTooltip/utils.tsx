import _ from 'lodash';

export const isString = (text: React.ReactNode) => {
  return typeof text === 'string' || typeof text === 'number';
};

export const isEmpty = (text: React.ReactNode) => {
  return _.isNil(text) || (typeof text === 'string' && text.length === 0);
};
