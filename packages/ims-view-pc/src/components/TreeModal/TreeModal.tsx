import { Col, Form, Modal, Row } from 'antd';
import _ from 'lodash';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import Item from './Item';
import './index.less';
import { TreeModalHandle, TreeModalProps, TreeModalType } from './interface';
import useDataEntities from './useDataEntities';
import { filterTree, treeToArray } from './utils';

const TreeModal = React.forwardRef<TreeModalHandle, TreeModalProps>((props, ref) => {
  //#region
  const {
    placeholder,
    options,
    defaultCheckKeys,
    value = [],
    children,
    preChildren,
    onChange,
    onOk,
    onCancel,
    modalProps,
    title = ['', ''],
    type = 'check',
    disabledKeys = [],
  } = props;
  const isView = type == 'view';
  const [visible, setVisible] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(value);
  const [leftExpandedKeys, setLeftExpandedKeys] = useState<string[]>([]);
  const [rightExpandedKeys, setRightExpandedKeys] = useState<string[]>([]);
  const [cacheHalfCheckedKeys, setCacheHalfCheckedKeys] = useState<any[]>([]);
  const rightOptions = React.useMemo(
    () =>
      filterTree(
        _.cloneDeep(options),
        checkedKeys.filter((ele) => !disabledKeys.includes(ele)),
        cacheHalfCheckedKeys,
      ),
    [options, checkedKeys, cacheHalfCheckedKeys, disabledKeys],
  );
  const originData = React.useMemo(() => treeToArray(_.cloneDeep(options)) || [], [options]);
  const fieldNames = {
    value: 'id',
    label: 'name',
    children: 'children',
    _title: ['name', 'title', 'label'],
  };
  const { keyEntities, valueEntities } = useDataEntities(options, fieldNames);

  useEffect(() => {
    if (value && value?.length > 0) {
      setCheckedKeys(value);
    }
  }, [value]);

  useEffect(() => {
    const result = conductCheck(checkedKeys, true, keyEntities);
    setCacheHalfCheckedKeys(result.halfCheckedKeys);
  }, [checkedKeys, options]);

  useEffect(() => {
    if (Array.isArray(defaultCheckKeys)) setCheckedKeys(defaultCheckKeys);
  }, [defaultCheckKeys]);

  useEffect(() => {
    handleSetDefaultParams();
  }, [options]);

  const handleSetDefaultParams = async (type?: 'left' | 'right') => {
    let defaultExpandKeys: string[] = [];
    (options || []).forEach((item) => {
      if (item.id) defaultExpandKeys.push(item.id);
      if (item.children) {
        item.children.forEach((child) => {
          // if (child?.id) defaultExpandKeys.push(child.id);
        });
      }
    });
    if (!type) {
      setLeftExpandedKeys(defaultExpandKeys);
      setRightExpandedKeys(defaultExpandKeys);
    }
    if (type == 'left') {
      setLeftExpandedKeys(defaultExpandKeys);
    } else {
      setRightExpandedKeys(defaultExpandKeys);
    }
  };

  const handleOpenModal = () => {
    handleSetDefaultParams();
    setVisible(true);
  };

  const handleOnCancelModal = () => {
    if (onCancel) onCancel(checkedKeys);
    setVisible(false);
  };

  const handleOnOkModal = () => {
    if (onChange) onChange?.(checkedKeys.filter((item) => !disabledKeys.includes(item)));
    if (onOk) onOk(checkedKeys);
    setVisible(false);
  };

  const handleOnExpand = (type: TreeModalType, expandedKeysValue: React.Key[]) => {
    if (type == 'left') {
      setLeftExpandedKeys(expandedKeysValue as string[]);
    } else {
      setRightExpandedKeys(expandedKeysValue as string[]);
    }
  };

  useImperativeHandle(ref, () => ({
    handleOpenModal,
    setCheckedKeys,
  }));
  const contextProvider = { handleOpenModal, checkedKeys, rightOptions, setCheckedKeys };

  const onSelect = (
    selectedKey: any,
    { selected, halfCheckedKeys }: { selected: boolean; halfCheckedKeys: any[] },
  ) => {
    const entity = keyEntities[selectedKey];
    const node = entity?.node;
    const selectedValue = node?.[fieldNames.value] ?? selectedKey;

    let result;
    if (selected) {
      result = conductCheck([...checkedKeys, selectedValue], true, keyEntities);
    } else {
      result = conductCheck(
        checkedKeys.filter((ele) => ele != selectedValue),
        { checked: false, halfCheckedKeys },
        keyEntities,
      );
    }
    setCheckedKeys(result?.checkedKeys as string[]);
  };

  return (
    <>
      <Form.Item className="TreeModal" style={{ marginBottom: 0 }}>
        <div>{typeof children === 'function' ? children(contextProvider) : children}</div>
        <Form.Item noStyle>
          <Modal
            confirmLoading={false}
            open={visible}
            okText="确认"
            cancelText="取消"
            onOk={handleOnOkModal}
            onCancel={handleOnCancelModal}
            forceRender
            centered
            maskClosable
            getContainer={false}
            className="modal"
            width={800}
            {...modalProps}
          >
            <div>
              {typeof preChildren === 'function' ? preChildren(contextProvider) : preChildren}
            </div>
            <Row gutter={0} align="top" justify="start">
              <Col>
                <Item
                  style={{ borderRight: 'none' }}
                  placeholder={placeholder?.[0]}
                  key="left"
                  type="left"
                  title={title?.[0]}
                  isView={isView}
                  options={options}
                  expandedKeys={leftExpandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={(e) => handleOnExpand('left', e as any as string[])}
                  onCheck={(key, node) => {
                    onSelect(node.node.key, {
                      halfCheckedKeys: node.checked
                        ? (node.halfCheckedKeys as any[])
                        : (cacheHalfCheckedKeys as any[]),
                      selected: !checkedKeys.includes(node.node.key as any),
                    });
                  }}
                  onClear={() => handleSetDefaultParams('left')}
                  setExpandedKeys={setLeftExpandedKeys}
                />
              </Col>
              <Col>
                <Item
                  placeholder={placeholder?.[0]}
                  key="right"
                  type="right"
                  title={title?.[1]}
                  isView={isView}
                  options={rightOptions}
                  expandedKeys={rightExpandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={(e) => handleOnExpand('right', e as any as string[])}
                  onCheck={(key, node: any) => {
                    onSelect(node.node.key, {
                      halfCheckedKeys: node.checked ? node.halfCheckedKeys : cacheHalfCheckedKeys,
                      selected: !checkedKeys.includes(node.node.key),
                    });
                  }}
                  setExpandedKeys={setRightExpandedKeys}
                  onClear={() => handleSetDefaultParams('right')}
                />
              </Col>
            </Row>
          </Modal>
        </Form.Item>
      </Form.Item>
    </>
  );
});

export default TreeModal;
