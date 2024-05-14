import { ModalProps, TreeProps } from 'antd';

export interface TreeModalData {
  id: string;
  name: string;
  dealMode?: number;
  memo?: string;
  channel: string;
  code: string;
  key?: React.Key;
  pid: string;
  priceType: string;
  disable?: boolean;
  children?: TreeModalData[];
}

export interface TreeModalFieldNames {
  value?: string;
  label?: string;
  children?: string;
}

export type TreeModalRawValueType = string | number;

type TreeModalModalOnConfirm = (value: string[]) => void;

export interface TreeModalLabeledValueType {
  key?: React.Key;
  value?: TreeModalRawValueType;
  label?: React.ReactNode;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type TreeModalDraftValueType =
  | TreeModalRawValueType
  | TreeModalLabeledValueType
  | (TreeModalRawValueType | TreeModalLabeledValueType)[];

export interface TreeModalProps {
  title?: [
    React.ReactNode | ((checkList: string[]) => React.ReactNode),
    React.ReactNode | ((checkList: string[]) => React.ReactNode),
  ];
  placeholder?: [string, string];
  type?: 'check' | 'view';
  children?: React.ReactNode | ((value: TreeModalContext) => React.ReactNode);
  value?: string[];
  options: TreeModalData[];
  defaultCheckKeys?: string[] | undefined;
  disabledKeys?: string[];
  onChange?: TreeModalModalOnConfirm;
  modalProps?: ModalProps;
  onOk?: TreeModalModalOnConfirm;
  onCancel?: TreeModalModalOnConfirm;
  preChildren?: React.ReactNode | ((value: TreeModalContext) => any);
}
export type TreeModalHandle = {
  handleOpenModal: () => void;
  setCheckedKeys: React.Dispatch<React.SetStateAction<string[]>>;
};
export interface TreeModalContext extends Pick<TreeModalProps, 'value'> {
  handleOpenModal: () => void;
  checkedKeys: TreeModalProps['value'];
  rightOptions: TreeModalProps['options'];
  setCheckedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export type TreeModalType = 'left' | 'right';

export interface TreeModalItemProps extends Omit<TreeProps, 'onExpand'> {
  placeholder?: string;
  type: TreeModalType;
  title?: React.ReactNode | ((checkList: string[]) => React.ReactNode);
  isView?: boolean;
  options?: TreeModalProps['options'];
  onExpand?: (type: TreeModalType, expandedKeys: React.Key[]) => void;
  setExpandedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  onClear?: Function;
}
