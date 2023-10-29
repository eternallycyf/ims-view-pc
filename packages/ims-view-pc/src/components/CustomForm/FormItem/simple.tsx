import { SearchOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  AutoCompleteProps,
  Checkbox,
  CheckboxProps,
  DatePicker,
  DatePickerProps,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  Radio,
  RadioGroupProps,
  RadioProps,
  Rate,
  RateProps,
  Slider,
  Switch,
  SwitchProps,
  TimePicker,
  TimePickerProps,
} from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { RangePickerProps } from 'antd/es/date-picker';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PasswordProps, TextAreaProps } from 'antd/es/input';
import { SliderBaseProps } from 'antd/es/slider';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { IBaseControlProps, IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea, Password, Search } = Input;
const { MonthPicker, RangePicker, QuarterPicker } = DatePicker;

dayjs.locale('zh-cn');

type ISimpleBaseControlProps = Partial<
  Pick<IBaseControlProps, 'Component' | 'dict' | 'renderItem'> &
    DatePickerProps &
    RangePickerProps &
    TimePickerProps &
    InputProps &
    PasswordProps &
    TextAreaProps &
    InputNumberProps &
    RateProps &
    SwitchProps &
    SliderBaseProps &
    AutoCompleteProps &
    CheckboxProps &
    CheckboxGroupProps &
    RadioProps &
    RadioGroupProps
>;

export interface ISimpleControlProps<T = string> extends IBaseCustomFormItemProps {
  controlProps: ISimpleBaseControlProps & {
    onChange?: any;
  };
  defaultVal?: {
    year?: {
      locale: any;
      picker: string;
      allowClear: boolean;
    };
    quarter?: {
      locale: any;
      picker: string;
      allowClear: boolean;
    };
    date?: {
      locale: any;
      showTime: boolean;
      format: string;
      allowClear: boolean;
    };
    month?: {
      locale: any;
      format: string;
      allowClear: boolean;
    };
    time?: {
      locale: any;
      format: string;
      allowClear: boolean;
    };
    dateRange?: {
      locale: any;
      format: string;
      allowClear: boolean;
    };
    input?: {
      placeholder: string;
      allowClear: boolean;
    };
    password?: {
      placeholder: string;
      allowClear: boolean;
    };
    textarea?: {
      placeholder: string;
      autoSize: { minRows: number; maxRows: number };
      allowClear: boolean;
    };
    search?: {
      placeholder: string;
      allowClear: boolean;
    };
    inputNumber: {
      min: number;
      max: number;
      placeholder: string;
    };
  };
  checked?: boolean;
  onChange: (value: T) => any;
  type:
    | 'date'
    | 'year'
    | 'quarter'
    | 'datetime'
    | 'month'
    | 'time'
    | 'dateRange'
    | 'input'
    | 'password'
    | 'textarea'
    | 'search'
    | 'rate'
    | 'switch'
    | 'inputNumber'
    | 'slider'
    | 'autoComplete'
    | 'checkbox'
    | 'radio'
    | 'custom';
  value: T;
}

const SimpleControl = React.forwardRef<any, ISimpleControlProps>((props, ref) => {
  const {
    name,
    form,
    type,
    dict,
    defaultVal,
    Component: CustomComponent,
    checked = false,
    controlProps: defaultControlProps = {},
    ...restProps
  } = props;

  let Component: any;
  let controlProps: Partial<ISimpleControlProps['controlProps']> = {
    ...defaultVal[type],
    ...defaultControlProps,
    ...restProps,
  };

  useImperativeHandle(ref, () => ({}));

  switch (type) {
    case 'date':
    case 'year':
      Component = DatePicker;
      break;
    case 'quarter':
      Component = QuarterPicker;
      break;
    case 'dateRange':
      Component = RangePicker;
      break;
    case 'month':
      Component = MonthPicker;
      break;
    case 'time':
      Component = TimePicker;
      break;
    case 'input':
      Component = Input;
      break;
    case 'password':
      Component = Password;
      break;
    case 'textarea':
      Component = TextArea;
      break;
    case 'search':
      Component = Input;
      break;
    case 'rate':
      Component = Rate;
      break;
    case 'switch':
      Component = Switch;
      break;
    case 'inputNumber':
      Component = InputNumber;
      break;
    case 'slider':
      Component = Slider;
      break;
    case 'custom':
      Component = CustomComponent;
  }

  const formProps = { form, name, type };

  if (type === 'autoComplete') {
    return (
      <AutoComplete ref={ref} {...controlProps}>
        {dict?.map((item) => (
          <AutoComplete.Option {...item} key={item.value} value={item.value}>
            {((controlProps.renderItem && controlProps.renderItem(item)) || item?.label) ?? '--'}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    );
  } else if (type === 'checkbox') {
    return (
      <CheckboxGroup ref={ref} {...(controlProps as any as CheckboxGroupProps)}>
        {dict?.map((item) => (
          <Checkbox {...item} key={item.value} value={item.value}>
            {item?.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  } else if (type === 'radio') {
    let RadioComp: any = Radio;
    if (controlProps.buttonStyle === 'solid') {
      RadioComp = Radio.Button;
    }
    return (
      <RadioGroup ref={ref} {...controlProps}>
        {dict?.map((item) => (
          <RadioComp {...item} key={item.value} value={item.value} title={item.label}>
            {item.label}
          </RadioComp>
        ))}
      </RadioGroup>
    );
  } else {
    const fillStyle = [
      'date',
      'year',
      'quarter',
      'datetime',
      'month',
      'time',
      'dateRange',
      'inputNumber',
    ].includes(type)
      ? {
          width: '100%',
        }
      : {};
    if (type === 'switch') {
      controlProps = { ...controlProps, checked: !!checked };
    }

    return (
      <Component
        ref={ref}
        prefix={type === 'search' ? <SearchOutlined /> : ''}
        {...controlProps}
        {...formProps}
        style={{ ...fillStyle, ...controlProps?.style }}
      />
    );
  }
});

SimpleControl.defaultProps = {
  defaultVal: {
    year: {
      locale,
      picker: 'year',
      allowClear: true,
    },
    quarter: {
      locale,
      picker: 'quarter',
      allowClear: true,
    },
    date: {
      locale,
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      allowClear: true,
    },
    month: {
      locale,
      format: 'YYYY-MM',
      allowClear: true,
    },
    time: {
      locale,
      format: 'HH:mm:ss',
      allowClear: true,
    },
    dateRange: {
      locale,
      format: 'YYYY-MM-DD',
      allowClear: true,
    },
    input: {
      placeholder: '请输入',
      allowClear: true,
    },
    password: {
      placeholder: '请输入',
      allowClear: true,
    },
    textarea: {
      placeholder: '请输入',
      autoSize: { minRows: 2, maxRows: 5 },
      allowClear: true,
    },
    search: {
      placeholder: '请输入',
      allowClear: true,
    },
    inputNumber: {
      min: 0,
      max: 100,
      placeholder: '请输入',
    },
  },
};

export default SimpleControl;
