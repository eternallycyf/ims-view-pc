import DefaultCustomTooltip from './CustomTooltip';
import Empty from './Empty';
import RichText from './RichText';

type CompoundedComponent = typeof DefaultCustomTooltip & {
  Empty: typeof Empty;
  RichText: typeof RichText;
};

const CustomTooltip = DefaultCustomTooltip as CompoundedComponent;

CustomTooltip.Empty = Empty;
CustomTooltip.RichText = RichText;

export default CustomTooltip;
