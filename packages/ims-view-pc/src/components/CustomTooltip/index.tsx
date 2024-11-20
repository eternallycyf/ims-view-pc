import ComputedTooltip from './CustomTooltip';
import Empty from './Empty';
import RichText from './RichText';

type CompoundedComponent = typeof ComputedTooltip & {
  Empty: typeof Empty;
  RichText: typeof RichText;
};

const CustomTooltip = ComputedTooltip as CompoundedComponent;

CustomTooltip.Empty = Empty;
CustomTooltip.RichText = RichText;

export default CustomTooltip;
