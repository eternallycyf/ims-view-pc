import type { FormInstance, ModalProps } from 'antd';
import { mapKeysDeep, sortBy } from './utils';

export interface CheckBoxRecord {
  label?: string;
  value?: string | number;
  disabled?: boolean;
}

export interface CheckModalBoxProps {
  label: string;
  value: CheckBoxRecord[];
  option: CheckBoxRecord[];
  onChange: (label: string, list: CheckBoxRecord[], option: CheckModalBoxProps['option']) => void;
}

export interface CheckModalProps {
  CheckModalRef?: React.Ref<CheckModalHandle>;
  form: FormInstance;
  name: string;
  option: Record<string, CheckBoxRecord[]>;
  value?: Record<string, CheckBoxRecord[] | any>;
  onChange?: (value: any) => void;
  modalProps?: ModalProps;
  onOk?: (value: any) => void;
  onCancel?: () => void;
}

export type CheckModalHandle = {
  sortBy: typeof sortBy;
  mapKeysDeep: typeof mapKeysDeep;
};
