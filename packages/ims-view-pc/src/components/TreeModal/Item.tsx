import { SearchOutlined } from '@ant-design/icons';
import { Divider, Empty, Input, Tree } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import { TreeModalItemProps } from './interface';
import { getSearchData } from './utils';

const TransformItem = (props: TreeModalItemProps) => {
  const {
    title = '',
    options,
    placeholder = '请输入',
    isView = false,
    setExpandedKeys,
    onExpand,
    expandedKeys,
    onCheck,
    checkedKeys,
    style,
    onClear,
  } = props;

  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setSearchValue('');
  }, [options]);

  const treeData = useMemo(() => {
    if (!options || options?.length == 0) return [];
    let expandList: string[] = [];

    if (!searchValue) return options;
    const newData = getSearchData(expandList, searchValue, _.cloneDeep(options));
    setExpandedKeys(expandList);
    expandList = [];
    return newData;
  }, [options, searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!e.target.value && onClear) onClear();
  };

  return (
    <>
      <div className="TreeModalItem" style={style}>
        <div className="header">
          <div>
            <div className="title">
              {typeof title === 'function' ? title(checkedKeys as any) : title}
            </div>
          </div>
          <Divider className="divider" />
        </div>
        <div className="content">
          <div className="searchBox">
            <div className="search">
              <Input
                key={JSON.stringify(options)}
                style={{ height: 26 }}
                placeholder={placeholder}
                onChange={handleSearch}
                suffix={<SearchOutlined />}
                allowClear
              />
            </div>
          </div>
          <div>
            {options?.length == 0 ? (
              <Empty />
            ) : (
              <Tree
                titleRender={(e: any) => {
                  if (e.flag == '2')
                    return (
                      <>
                        {e?.name}
                        <span style={{ color: '#FA6A0A', marginLeft: 6 }}>&nbsp;即将到期</span>
                      </>
                    );
                  return e?.name;
                }}
                key="all"
                height={320}
                // checkStrictly
                fieldNames={{ title: 'name', key: 'id' }}
                checkable
                onExpand={onExpand as any}
                expandedKeys={expandedKeys}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={treeData as any[]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransformItem;
