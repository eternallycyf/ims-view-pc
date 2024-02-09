import { Col, Empty, Form, FormListFieldData, FormListOperation, Row } from 'antd';
import {
  ErrorBoundary,
  IButtonProps,
  ICommonEditTableColumnsType,
  ICommonEditTableHandle,
  ICommonEditTableProps,
  IEditButtonProps,
  IEditTableContext,
  IGetColumns,
  IRenderFnProps,
  Theme,
  renderFormItem,
} from 'ims-view-pc';
import React, { Key, useImperativeHandle } from 'react';
import { formatColumn } from '../../core/helpers';
import { Table } from './';
import TableBtn from './TableBtn';
import './index.less';
import {
  addExtraIndexParams,
  formatEditTableColumns,
  getCurrentFieldValue,
  removeExtraColumnsProps,
} from './utils';

const CommonEditTable: React.ForwardRefRenderFunction<
  ICommonEditTableHandle,
  ICommonEditTableProps
> = (props, ref) => {
  // #region
  const {
    form,
    status = 'edit',
    showIndex = true,
    isVirtual = false,
    isMultiple = true,
    editableKeys = [],
    itemButtonWidth,

    beforeChildren,
    afterChildren,

    tableProps = {},
    columns = [],
    itemButton = [],
    buttonLeft = [],
    buttonRight = [],
    buttonBottomLeft = [],
    buttonBottomRight = [],

    name: tableFormName = 'EditTable',
    formListProps = {},
    initialValues,
    rules = [],
  } = props;
  const {} = tableProps;
  const EditTableContextInitProps = {
    form,
    operation: {},
    values: [],
    status,
  } as IEditTableContext;
  const EditTableContext = React.createContext<IEditTableContext>(EditTableContextInitProps);

  useImperativeHandle(ref, () => ({
    form,
    status,
  }));

  const EditTableContextProviderProps = {
    form,
    values: form?.getFieldValue(tableFormName) || [],
    status,
  };

  //#endregion

  // #region
  const getDefaultColumns: IGetColumns = (operation, status) => {
    const values = form?.getFieldValue(tableFormName) || [];

    let newColumns = columns.map((item: ICommonEditTableColumnsType) => {
      const {
        dataIndex,
        label,
        formItemProps,
        type = 'view',
        editable = true,
        onHeaderCell,
        hasRequiredMark = false,
        ...restTableProps
      } = item;
      const {
        initialValue,
        rules = [],
        layout,
        itemProps,
        controlProps,
        ...restItem
      } = formItemProps || {};
      return {
        dataIndex,
        ...restTableProps,
        onHeaderCell: (columns: any) => {
          const restOnHeaderCellProps = onHeaderCell ? onHeaderCell?.(columns) : {};
          return {
            ...restOnHeaderCellProps,
            className: `${restOnHeaderCellProps?.className} ${hasRequiredMark && 'isRequired'}`,
          };
        },
        render: (text: number, field: FormListFieldData, index: number) => {
          const renderProps = getCurrentFieldValue(form, tableFormName, index);
          //@ts-ignore
          const val = renderProps?.[0]?.[item?.dataIndex];
          const currentValues = renderProps?.[0];
          const allValues = renderProps?.[1];
          const name = [field.name, dataIndex] as Key[];
          const key = field.key;
          const formProps = {
            ...restItem,
            controlProps: addExtraIndexParams(controlProps, index),
            editable,
            name,
            type,
          };

          if (type == 'custom') {
            return item.render?.(val, currentValues, index, allValues);
          }

          if (status == 'view' || !editable) {
            if (item.transform) {
              return item.transform?.(val, currentValues, index, allValues);
            }
            if (item.render) {
              return item.render?.(val, currentValues, index, allValues);
            }
            return formatEditTableColumns(item, val);
          }

          const getContent = ({
            form,
            formProps,
            index,
            type,
          }: {
            form: any;
            formProps: any;
            index: number;
            type: any;
          }) => {
            if (type == 'update') {
              // FAQ: 可编辑表格使用 type == 'update'
              // 为Form.Item.type == 'update' 注入 index
              return (
                <Row {...itemProps}>
                  {renderFormItem({
                    ...formProps,
                    itemProps: addExtraIndexParams(itemProps, index),
                  })}
                </Row>
              );
            }
            return (
              <Form.Item
                labelAlign="right"
                label={label as string}
                name={name}
                key={key}
                rules={rules || itemProps?.rules || []}
                initialValue={initialValue}
                {...itemProps}
              >
                {renderFormItem(formProps, index)}
              </Form.Item>
            );
          };

          if (isMultiple) return getContent({ type, formProps, index, form } as any);

          return (
            <Form.Item noStyle shouldUpdate={true}>
              {(inLineForm) => {
                const currentValue = inLineForm?.getFieldValue(tableFormName) || []?.[name as any];
                if (!isMultiple && !editableKeys.includes(String(currentValue?.[index]?.key))) {
                  if (item.transform) {
                    return item.transform?.(val, currentValues, index, allValues);
                  }
                  if (item.render) {
                    return item.render?.(val, currentValues, index, allValues);
                  }
                  return formatEditTableColumns(item, val);
                }
                return getContent({ type, formProps, index, form } as any);
              }}
            </Form.Item>
          );
        },
      };
    });
    if (itemButton && itemButton?.length != 0 && status === 'edit') {
      newColumns.push({
        title: '操作',
        align: 'center',
        width: itemButtonWidth || (values && values?.length != 0) ? itemButton.length * 70 : 60,
        dataIndex: 'operation',
        render: (text: number, field: FormListFieldData, index: number) => {
          const renderProps = getCurrentFieldValue(form, tableFormName, index);
          return renderButtonRow(itemButton as any, [], operation, {
            record: renderProps?.[0],
            arr: renderProps?.[1],
            index,
          });
        },
        onHeaderCell: null as any,
      });
    }
    if (showIndex) {
      newColumns.unshift({
        title: '序号',
        align: 'center',
        width: 60,
        render: (text: number, field: FormListFieldData, index: number) =>
          isVirtual ? field.key + 1 : index + 1,
      } as any);
    }

    // 解除传递 formatNumber 等参数 控制台报错问题
    return removeExtraColumnsProps(formatColumn(newColumns));
  };

  const renderButtonRow = (
    buttonLeft: IEditButtonProps[] = [],
    buttonRight: IEditButtonProps[] = [],
    operation: FormListOperation,
    renderProps?: IRenderFnProps<any> | undefined,
  ) => {
    if (!buttonLeft.length && !buttonRight.length) return null;

    const getBtnProps = (button: IEditButtonProps[]) => {
      return button.map((item) => {
        if (typeof item === 'function') {
          const result: any = item(renderProps, operation, status);
          const params =
            typeof result === 'function' ? result({ editableKeys, ...props.curryParams }) : result;
          return {
            ...params,
            visible: params?.visible || true,
          };
        }

        const onClick =
          typeof item?.itemProps?.buttonProps?.onClick === 'function'
            ? item.itemProps.buttonProps.onClick.bind(null, renderProps, operation, status)
            : undefined;
        const handleDeleteConfirm =
          typeof item?.itemProps?.handleDeleteConfirm === 'function'
            ? item.itemProps.handleDeleteConfirm.bind(null, renderProps, operation, status)
            : undefined;
        const handleGroupValueOnChange =
          typeof item?.itemProps?.handleGroupValueOnChange === 'function'
            ? item.itemProps.handleGroupValueOnChange.bind(null, renderProps, operation, status)
            : undefined;

        const btnProps: IButtonProps = {
          ...item,
          itemProps: {
            ...item?.itemProps,
            buttonProps: {
              ...item?.itemProps?.buttonProps,
              onClick,
            },
            handleDeleteConfirm,
            handleGroupValueOnChange,
          },
          // FAQ: 当不是函数形式时 为了兼容tableBtn的visible 所以取函数形式
          visible: () => {
            if (item.visible == undefined) return true;
            if (typeof item.visible === 'function')
              return item.visible(renderProps as any, operation, status);
            return item.visible;
          },
        };

        return btnProps;
      });
    };

    if (renderProps) {
      return (
        <TableBtn style={{ justifyContent: 'center' }} button={getBtnProps(buttonLeft) as any} />
      );
    }

    return (
      <Form.Item noStyle>
        <Row justify="space-between" align="middle">
          <Col>
            <TableBtn button={getBtnProps(buttonLeft) as any} />
          </Col>
          <Col>
            <TableBtn button={getBtnProps(buttonRight) as any} />
          </Col>
        </Row>
      </Form.Item>
    );
  };
  //#endregion

  return (
    <ErrorBoundary>
      <Form.List name={tableFormName} initialValue={initialValues} rules={rules} {...formListProps}>
        {(fields, operation, { errors }) => {
          return (
            <EditTableContext.Provider value={{ ...EditTableContextProviderProps, operation }}>
              <Form.Item noStyle>
                <EditTableContext.Consumer>
                  {typeof beforeChildren === 'function' ? beforeChildren : () => null}
                </EditTableContext.Consumer>
              </Form.Item>
              {renderButtonRow(buttonLeft, buttonRight, operation)}
              <Form.Item className="EditTableContent">
                <Table
                  className={`${fields?.length > 0 ? '' : 'noDataTable'} ${tableProps?.className}`}
                  isVirtual={fields?.length >= 100 ? isVirtual : false}
                  status={status}
                  scroll={isVirtual ? { y: 800 } : false}
                  onSearchOrReset={(scrollRef: any) =>
                    scrollRef?.current?.dispatchEvent(new CustomEvent('scroll'))
                  }
                  dataSource={fields}
                  columns={getDefaultColumns(operation, status)}
                  rowKey={'key'}
                  pagination={false}
                  bordered
                  size="small"
                  locale={{
                    emptyText: (
                      <Empty
                        description={<span style={{ color: '#B3B8C2' }}>暂无数据</span>}
                        style={{
                          color: '#B3B8C2',
                          fontSize: 12,
                          marginTop: 8,
                          marginBottom: 10,
                        }}
                        image={<Theme.Empty.Doc />}
                      />
                    ),
                  }}
                  {...tableProps}
                />
              </Form.Item>
              {renderButtonRow(buttonBottomLeft, buttonBottomRight, operation)}
              <Form.Item noStyle>
                <EditTableContext.Consumer>
                  {typeof afterChildren === 'function' ? afterChildren : () => null}
                </EditTableContext.Consumer>
              </Form.Item>
              <Form.ErrorList errors={errors} />
            </EditTableContext.Provider>
          );
        }}
      </Form.List>
    </ErrorBoundary>
  );
};

export default CommonEditTable;
