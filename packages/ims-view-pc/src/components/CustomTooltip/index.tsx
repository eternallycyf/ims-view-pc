import DefaultCustomTooltip from './CustomTooltip';
import Empty from './Empty';
import FileNameEllipsis from './FileNameEllipsis';
import Paragraph from './Paragraph';
import RichText from './RichText';
import CustomTip from './CustomTip'

type CompoundedComponent = typeof DefaultCustomTooltip & {
  Empty: typeof Empty;
  RichText: typeof RichText;
  Paragraph: typeof Paragraph;
  FileNameEllipsis: typeof FileNameEllipsis;
  CustomTip: typeof CustomTip
};

const CustomTooltip = DefaultCustomTooltip as CompoundedComponent;

CustomTooltip.Empty = Empty;
CustomTooltip.RichText = RichText;
CustomTooltip.Paragraph = Paragraph;
CustomTooltip.FileNameEllipsis = FileNameEllipsis;
CustomTooltip.CustomTip = CustomTip

export default CustomTooltip;
