import { Button, Col, Form, Radio, RadioChangeEvent, Row } from 'antd';
import { TreeModal, type TreeModalData } from 'ims-view-pc';
import React, { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { OriginTreeData } from './constant';

const { arrayToTree } = TreeModal.Utils;

const IndexPage = () => {
  const [form] = Form.useForm();
  // 研报radio options  {label:'xxxx',value:'xxx'}[]
  const [options, setOptions] = React.useState<any[]>([]);
  // 当前选中的研报类型id
  const [currentRatio, setCurrentRatio] = React.useState<string>();
  // 当前树形结构数据
  const [data, setData] = React.useState<TreeModalData[]>([]);
  const [defaultCheckKeys, setDefaultCheckKeys] = React.useState<string[]>([]);
  // 上次订阅的栏目

  // 初始化后端给的数据 初始化后端给的数据转树形结构 默认选中项 默认禁用项
  const [{ value: defaultData = [], loading }, fetchData] = useAsyncFn<
    () => Promise<[TreeModalData[], TreeModalData[], string[], string[]]>
  >(async () => {
    const defaultCheckList = ['607010', '605001', '602456', '60245602', '60245601'];
    const disabledList = ['607010'];
    OriginTreeData.forEach((item) => {
      if (disabledList.includes(item.id)) {
        //@ts-ignore
        item.disabled = true;
      }
    });
    const newData = arrayToTree(OriginTreeData || [], '-2') || [];
    return [OriginTreeData || [], newData || [], defaultCheckList || [], disabledList || []];
  }, []);
  const [originData, treeData, lastCheckList, disabledList] = defaultData;

  useEffect(() => {
    handleInitPage();
  }, []);

  const handleInitPage = async () => {
    const [originData, newData, lastCheckList] = await fetchData();
    const options = (newData || []).map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
    const defaultRadio = options[0]?.id;
    const currentOptions = (newData || []).filter((item) => item?.id == defaultRadio);
    const currentData = originData.filter((item) => item.priceType == defaultRadio);

    setOptions(options);
    setCurrentRatio(defaultRadio);
    setData(currentOptions);
    handleSetDefaultCheckKeys(currentData, lastCheckList);
  };

  const handleSetDefaultCheckKeys = (data: TreeModalData[], lastCheckList: string[]) => {
    const currentCheckList = data.filter((item) => lastCheckList.includes(item.id));
    const checkId = currentCheckList.map((item) => item?.id)?.filter(Boolean);
    setDefaultCheckKeys(checkId);
  };

  const handleRadioOnChange = (e: RadioChangeEvent) => {
    const currentRadio = e.target.value;
    const currentOptions = (treeData || []).filter((item) => item?.id == currentRadio);
    const currentData = (originData || []).filter((item) => item?.priceType == currentRadio);
    setCurrentRatio(currentRadio);
    setData(currentOptions);
    handleSetDefaultCheckKeys(currentData, lastCheckList);
  };

  return (
    <Form form={form} onFinish={(values) => console.log(values)}>
      <Form.Item name="tree" label="tree">
        <TreeModal
          modalProps={{ title: '新增订阅栏目' }}
          title={[
            '请选择订阅栏目',
            (checkList) => (
              <span>
                新增栏目
                <span className="TreeModalItemNumber">
                  （{checkList?.length || 0}/
                  {originData?.filter((item) => item?.priceType == currentRatio)?.length || 0}）
                </span>
              </span>
            ),
          ]}
          placeholder={['请选择栏目名称', '请选择栏目名称']}
          defaultCheckKeys={defaultCheckKeys}
          disabledKeys={disabledList}
          options={data}
          preChildren={(context) => {
            return (
              <>
                <Button onClick={() => form.setFieldsValue({ tree: undefined })}>rest value</Button>
                <Button onClick={() => context.setCheckedKeys([])}>rest selected</Button>
                <div>仅取消订阅无新增栏目时，不会发起OA审批流程,提交流程后立即生效!</div>
                <Form.Item>
                  <Row gutter={16} style={{ margin: '12px 0' }}>
                    <Col span={24}>
                      <Form.Item label="订阅时间">2023年11月07日</Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="研报类型">
                        <Radio.Group
                          value={currentRatio}
                          onChange={handleRadioOnChange}
                          options={options}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </>
            );
          }}
        >
          {(context) => {
            return (
              <Form.Item>
                <Button onClick={context.handleOpenModal}>打开弹窗</Button>
              </Form.Item>
            );
          }}
        </TreeModal>
      </Form.Item>
      <Form.Item shouldUpdate={() => true}>
        {(content) => <pre>{JSON.stringify(content.getFieldValue('tree'), null, 2)}</pre>}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};

export default IndexPage;
