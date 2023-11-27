import { SearchOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  AutoCompleteProps,
  Checkbox,
  CheckboxProps,
  DatePicker,
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
} from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PasswordProps, TextAreaProps } from 'antd/es/input';
import { SliderBaseProps } from 'antd/es/slider';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { AnyObject, DeepPartial, IBaseControlProps, IBaseCustomFormItemProps } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea, Password, Search } = Input;
const { MonthPicker, RangePicker, QuarterPicker } = DatePicker;

dayjs.locale('zh-cn');

interface IBaseSimpleBaseControlProps extends Pick<IBaseControlProps, 'Component' | 'dict'> {}

type ISimpleBaseControlProps = IBaseSimpleBaseControlProps &
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
  RadioGroupProps;

export interface ISimpleControlProps<T = AnyObject>
  extends Omit<IBaseCustomFormItemProps<T>, 'type'> {
  controlProps: DeepPartial<Omit<ISimpleBaseControlProps, 'placeholder'>> & {
    onChange?: any;
    placeholder?: string | string[] | undefined;
  };
  defaultVal?: any;
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
    label,
    form,
    type,
    dict,
    defaultVal,
    Component: CustomComponent,
    checked = false,
    controlProps: defaultControlProps = {},
    itemProps,
    ...restProps
  } = props;

  const _getPlaceholder = () => {
    let defaultType = ['input', 'password', 'textarea', 'search', 'inputNumber'].includes(type)
      ? 'input'
      : 'select';
    if (type === 'autoComplete') {
      defaultType = 'select';
    }
    return defaultControlProps?.placeholder
      ? defaultControlProps?.placeholder
      : typeof label === 'string' && label?.length <= 5
      ? `${defaultType === 'input' ? `请输入${label}` : `请选择${label}`}`
      : `${defaultType === 'input' ? '请输入' : '请选择'}`;
  };

  let Component: any;
  let controlProps: any = {
    ...defaultVal[type],
    placeholder: _getPlaceholder(),
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
      Component = Search;
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
    return <AutoComplete ref={ref} options={dict as any as any} {...controlProps}></AutoComplete>;
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
      placeholder: '请选择年份',
    },
    quarter: {
      locale,
      picker: 'quarter',
      allowClear: true,
      placeholder: '请选择季度',
    },
    date: {
      locale,
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      allowClear: true,
      placeholder: '请选择日期',
    },
    month: {
      locale,
      format: 'YYYY-MM',
      allowClear: true,
      placeholder: '请选择月份',
    },
    time: {
      locale,
      format: 'HH:mm:ss',
      allowClear: true,
      placeholder: '请选择时间',
    },
    dateRange: {
      locale,
      format: 'YYYY-MM-DD',
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
    input: {
      allowClear: true,
    },
    password: {
      allowClear: true,
    },
    textarea: {
      autoSize: { minRows: 2, maxRows: 5 },
      allowClear: true,
    },
    search: {
      allowClear: true,
    },
    inputNumber: {
      min: 0,
      max: 100,
    },
  },
};

export default SimpleControl;
