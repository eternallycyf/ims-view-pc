import { ProDescriptions } from '@ant-design/pro-descriptions';
import './index.less';
import type { CustomDescriptionsProps } from './interface';
const Descriptions = (props: CustomDescriptionsProps) => {
  return <ProDescriptions {...props} />;
};

export default Descriptions;
