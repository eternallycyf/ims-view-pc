import type { DataEntity } from 'rc-tree/lib/interface';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import * as React from 'react';
import type { TreeModalFieldNames, TreeModalRawValueType } from './interface';

export default (treeData: any, fieldNames: TreeModalFieldNames) =>
  React.useMemo<{
    valueEntities: Map<TreeModalRawValueType, DataEntity>;
    keyEntities: Record<string, DataEntity>;
  }>(() => {
    const collection = convertDataToEntities(treeData, {
      fieldNames,
      initWrapper: (wrapper) => ({
        ...wrapper,
        valueEntities: new Map(),
      }),
      processEntity: (entity, wrapper: any) => {
        //@ts-ignore
        const val = entity.node[fieldNames?.value];

        wrapper.valueEntities.set(val, entity);
      },
    });

    return collection as any;
  }, [treeData, fieldNames]);
