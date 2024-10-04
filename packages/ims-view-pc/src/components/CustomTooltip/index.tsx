import ComputedTooltip from './CustomTooltip';
import Empty from './Empty';

type CompoundedComponent = typeof ComputedTooltip & {
  Empty: typeof Empty;
};

const CustomTooltip = ComputedTooltip as CompoundedComponent;

CustomTooltip.Empty = Empty;

export default CustomTooltip;
