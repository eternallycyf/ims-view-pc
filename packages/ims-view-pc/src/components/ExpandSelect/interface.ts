import type { SelectProps } from 'antd';

export interface ExpandSelectValue {
  label?: string;
  value?: React.Key;
  disabled?: boolean;
  isCustom?: boolean;
}

export interface ExpandSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  addInputPlaceholder?: string;
  options?: ExpandSelectValue[];
  value?: ExpandSelectValue[];
  onChange?: (value: ExpandSelectValue[]) => any;
}
