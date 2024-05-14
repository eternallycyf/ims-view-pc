import Item from './Item';
import TreeModal from './TreeModal';
import { arrayToTree, filterTree, getSearchData, treeToArray } from './utils';

type CompoundedComponent = typeof TreeModal & {
  Item: typeof Item;
  Utils: {
    arrayToTree: typeof arrayToTree;
    filterTree: typeof filterTree;
    treeToArray: typeof treeToArray;
    getSearchData: typeof getSearchData;
  };
};

const CommonTreeModal = TreeModal as CompoundedComponent;

CommonTreeModal.Item = Item;
CommonTreeModal.Utils = {
  arrayToTree,
  filterTree,
  treeToArray,
  getSearchData,
};

export default CommonTreeModal;
