import { Button, Checkbox, Col, Form, Modal, Row, Tag } from 'antd';
import _ from 'lodash';
import React, { useImperativeHandle, useState } from 'react';
import { useMap } from 'react-use';
import './index.less';
import type {
  CheckBoxRecord,
  CheckModalBoxProps,
  CheckModalHandle,
  CheckModalProps,
} from './interface';
import { mapKeysDeep, sortBy } from './utils';

const CustomCheckBox = (props: CheckModalBoxProps) => {
  const { label, value, option, onChange } = props;

  const handleCheckBoxOnChange = (currentValList: any[]) => {
    const newValList = currentValList.map((item) => option.find((ele) => ele.value === item)!);
    onChange(label, newValList, option);
  };

  return (
    <Form.Item label={label} key={label} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Checkbox.Group
        onChange={handleCheckBoxOnChange}
        value={Object.keys(value)?.length != 0 ? (value || [])?.map((item) => item.value) : []}
        style={{ width: '100%', display: 'inline-block' }}
      >
        <Row>
          {option.map((item) => (
            <Col span={6} key={item.value}>
              <Checkbox value={item.value}>{item.label ?? '--'}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </Form.Item>
  );
};

const CheckModal: React.ForwardRefRenderFunction<CheckModalHandle, CheckModalProps> = (props) => {
  const {
    form,
    name,
    value = {},
    onChange,
    option,
    onOk,
    onCancel,
    modalProps,
    CheckModalRef,
  } = props;
  const [list, { set: setList, setAll, remove, reset }] = useMap(value);
  const [visible, setVisible] = useState<boolean>(false);
  const [cacheList, setCacheList] = useState<Record<string, CheckBoxRecord[]>>(value);

  useImperativeHandle(CheckModalRef, () => ({
    sortBy,
    mapKeysDeep,
  }));

  const triggerChange = (changedValue: any) => {
    form.setFieldsValue({ [name]: changedValue?.value });
    onChange?.(changedValue);
  };

  const handleCheckBoxOnChange: CheckModalBoxProps['onChange'] = (label, arr, option) => {
    const newList = { ...list };
    newList[label] = arr || [];
    newList.value = _.omit(newList, 'value');
    setAll(newList);
    triggerChange({ ...newList, value: _.omit(newList, 'value') });
  };

  const handleOnOkModal = () => {
    if (form) {
      form.setFieldsValue({ [name]: list });
    }
    setCacheList(list);
    setVisible(false);
    onOk && onOk(list);
  };

  const handleOnCancelModal = () => {
    setVisible(false);
    setAll(cacheList);
    onCancel && onCancel();
  };

  const handleSelect = () => {
    setVisible(true);
  };

  const handelOnClose = (label: string, itemLabel: string) => {
    const newList = { ...list };
    const arr = (list[label] || []).filter((item: CheckBoxRecord) => item.label !== itemLabel);
    newList[label] = arr || [];
    newList.value = _.omit(newList, 'value');
    setAll(newList);
    setCacheList(newList);
    triggerChange({ ...newList, value: _.omit(newList, 'value') });
  };

  const renderContent = () => {
    if (!list) return null;
    let arr: any = [];
    // eslint-disable-next-line array-callback-return
    Object.entries(list).map(([key, val]) => {
      val?.length !== 0 && arr.push(val);
    });
    if (!arr.length) return null;

    const newList: Record<string, CheckBoxRecord[]> = Object.entries(list).reduce(
      (acc, [key, val]) => {
        if (val?.length !== 0) {
          acc[key] = val;
        }
        return acc;
      },
      {},
    );

    return (
      <>
        {_.omit(newList, 'value') &&
          sortBy(Object.entries(_.omit(newList, 'value')), Object.keys(option)).map(
            ([label, value]) => {
              return (
                <Form.Item label={label} key={Math.random()} className="expandContent">
                  <Row gutter={[4, 4]}>
                    {(value || [])?.map((item) => (
                      <Col key={item.value}>
                        <Tag
                          className="parmary-tag"
                          closable
                          onClose={() => handelOnClose(label, item.label)}
                        >
                          {item.label}
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              );
            },
          )}
      </>
    );
  };

  return (
    <Form.Item className="checkModal" style={{ marginBottom: 0 }}>
      <Button onClick={handleSelect} className="parmary-btn" size="small" type="default">
        选择
      </Button>
      {renderContent()}
      <Modal
        confirmLoading={false}
        title="标签权限"
        open={visible}
        okText="确认"
        cancelText="取消"
        onOk={handleOnOkModal}
        onCancel={handleOnCancelModal}
        destroyOnClose
        centered
        maskClosable
        getContainer={false}
        className="check-modal-checkbox-group "
        width={630}
        {...modalProps}
      >
        {Object.entries(_.omit(option, 'value')).map(([label, val]) => {
          return CustomCheckBox({
            label,
            value: list?.[label] || {},
            option: option[label],
            onChange: handleCheckBoxOnChange,
          });
        })}
      </Modal>
    </Form.Item>
  );
};

export default React.forwardRef(CheckModal);
