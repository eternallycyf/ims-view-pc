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
  type SelectProps,
} from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { RangePickerProps } from 'antd/es/date-picker';
import { PickerProps } from 'antd/es/date-picker/generatePicker';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PasswordProps, TextAreaProps } from 'antd/es/input';
import { SliderBaseProps } from 'antd/es/slider';
import { DatePickerProps } from 'antd/lib';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import { AnyObject, DeepPartial, IBaseControlProps, IBaseCustomFormItemProps } from 'ims-view-pc';
import _ from 'lodash';
import React, { useImperativeHandle, type ReactNode } from 'react';
const RadioGroup = Radio.Group;
const CheckboxGroup: any = Checkbox.Group;
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
  controlProps: DeepPartial<
    Omit<ISimpleBaseControlProps, 'placeholder' | 'prefix' | 'size' | 'mode'>
  > &
    DeepPartial<Omit<DatePickerProps, 'placeholder' | 'prefix' | 'size' | 'mode'>> &
    DeepPartial<Omit<RangePickerProps, 'placeholder' | 'prefix' | 'size' | 'mode'>> & {
      onChange?: (...args: any[]) => any;
      placeholder?: any;
      prefix?: ReactNode;
      picker?: PickerProps<Dayjs>['picker'];
      size?: SizeType;
      mode?: SelectProps['mode'];
    };
  defaultVal?: any;
  checked?: boolean;
  onChange: (value: T) => any;
  type:
    | 'time'
    | 'date'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year'
    | 'timeRange'
    | 'dateRange'
    | 'weekRange'
    | 'monthRange'
    | 'quarterRange'
    | 'yearRange'
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
    onChange,
    record,
    value,
    id,
  } = props;

  const _getPlaceholder = () => {
    let defaultType = ['input', 'password', 'textarea', 'search', 'inputNumber'].includes(type)
      ? 'input'
      : 'select';
    if (type === 'autoComplete') {
      defaultType = 'select';
    }

    if (
      [
        'time',
        'date',
        'week',
        'month',
        'quarter',
        'year',
        'timeRange',
        'dateRange',
        'weekRange',
        'monthRange',
        'quarterRange',
        'yearRange',
      ].includes(type)
    ) {
      return defaultControlProps?.placeholder || defaultVal[type]?.placeholder;
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
    onChange: (...arg) => {
      //@ts-ignore
      onChange && onChange(...arg);
      if (defaultControlProps?.onChange) {
        defaultControlProps?.onChange(...arg);
      }
    },
    record,
    value,
    id,
  };

  useImperativeHandle(ref, () => ({}));

  switch (type) {
    case 'time':
      Component = TimePicker;
      break;
    case 'date':
    case 'week':
    case 'month':
    case 'quarter':
    case 'year':
      Component = DatePicker;
      break;
    case 'timeRange':
    case 'dateRange':
    case 'weekRange':
    case 'monthRange':
    case 'quarterRange':
    case 'yearRange':
      Component = RangePicker;
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
      <CheckboxGroup {...(controlProps as any as CheckboxGroupProps)}>
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
      'time',
      'date',
      'week',
      'month',
      'quarter',
      'year',
      'timeRange',
      'dateRange',
      'weekRange',
      'monthRange',
      'quarterRange',
      'yearRange',
    ].includes(type)
      ? {
          width: '100%',
        }
      : {};
    if (type === 'switch') {
      controlProps = { ...controlProps, checked: !!checked };
    }

    if (type === 'custom') {
      return Component({
        ref,
        ...controlProps,
        ...formProps,
        ...fillStyle,
        ...controlProps?.style,
      });
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
    time: {
      locale,
      format: 'HH:mm:ss',
      allowClear: true,
      placeholder: '请选择时间',
    },
    date: {
      locale,
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      allowClear: true,
      placeholder: '请选择日期',
    },
    week: {
      locale,
      picker: 'week',
      format: 'YYYY-wo',
      allowClear: true,
      placeholder: '请选择周',
    },
    month: {
      locale,
      picker: 'month',
      format: 'YYYY-MM',
      allowClear: true,
      placeholder: '请选择月份',
    },
    quarter: {
      locale,
      picker: 'quarter',
      format: 'YYYY-[Q]Q',
      allowClear: true,
      placeholder: '请选择季度',
    },
    year: {
      locale,
      picker: 'year',
      format: 'YYYY',
      allowClear: true,
      placeholder: '请选择年份',
    },
    timeRange: {
      locale,
      format: 'HH:mm:ss',
      allowClear: true,
      placeholder: ['开始时间', '结束时间'],
    },
    dateRange: {
      locale,
      format: 'YYYY-MM-DD',
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
    weekRange: {
      locale,
      format: 'YYYY-wo',
      allowClear: true,
      placeholder: ['开始周', '结束周'],
      picker: 'week',
    },
    monthRange: {
      locale,
      format: 'YYYY-MM',
      allowClear: true,
      placeholder: ['开始月份', '结束月份'],
      picker: 'month',
    },
    quarterRange: {
      locale,
      format: 'YYYY-[Q]Q',
      allowClear: true,
      placeholder: ['开始季度', '结束季度'],
      picker: 'quarter',
    },
    yearRange: {
      locale,
      format: 'YYYY',
      allowClear: true,
      placeholder: ['开始年份', '结束年份'],
      picker: 'year',
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
