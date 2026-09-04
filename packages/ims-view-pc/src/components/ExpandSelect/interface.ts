import type { SelectProps } from 'antd';

export interface ExpandSelectValue {
  label?: string;
  value?: React.Key;
  disabled?: boolean;
  isCustom?: boolean;
}

export interface CategoryTab {
  label: string;
  value: string;
}

export interface ExpandSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  addInputPlaceholder?: string;
  options?: ExpandSelectValue[];
  value?: ExpandSelectValue[];
  onChange?: (value: ExpandSelectValue[]) => any;
  categoryTabs?: CategoryTab[];
  categoryOptionsMap?: Record<string, ExpandSelectValue[]>;
  enableCategoryTab?: boolean;
  onCategoryTabChange?: (value: string) => void;
  popupClassName?: string;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  dropdownRender?: SelectProps['popupRender'];
  popupRender?: SelectProps['popupRender'];
}
