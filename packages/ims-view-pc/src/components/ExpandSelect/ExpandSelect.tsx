import { Select } from 'antd';
import { FC } from 'react';
import './index.less';
import type { ExpandSelectProps } from './interface';
const { Option } = Select;

const ExpandSelect: FC<ExpandSelectProps> = (props) => {
  const { options = [], ...restProps } = props;
  return (
    <div className="ExpandSelect">
      <Select
        defaultValue={[
          { label: 'jack', value: '1' },
          { label: 'lucy', value: '2' },
          { label: 'Yiminghe', value: '3' },
          { label: '4', value: '4' },
        ]}
        mode="multiple"
        maxTagCount={3}
        style={{ width: 300 }}
        showSearch
        filterOption={false}
        className="ExpandSelectBox"
        popupClassName="ExpandSelectBoxSelects"
        dropdownStyle={{ height: 300, width: 600, overflow: 'scroll' }}
        {...restProps}
      >
        {options.map((item, index) => (
          <Option className="ExpandSelectOptions" value={item?.value} key={index}>
            {item?.label ?? '--'}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ExpandSelect;
