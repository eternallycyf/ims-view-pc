import DefaultCustomTooltip from './CustomTooltip';
import CustomTip from './CustomTip';
import Dropdown from './Dropdown';
import Empty from './Empty';
import FileNameEllipsis from './FileNameEllipsis';
import Paragraph from './Paragraph';
import RichText from './RichText';
import SelectEmpty from './SelectEmpty';
import TableEmpty from './TableEmpty';

type CompoundedComponent = typeof DefaultCustomTooltip & {
  Paragraph: typeof Paragraph;
  Empty: typeof Empty;
  RichText: typeof RichText;
  FileNameEllipsis: typeof FileNameEllipsis;
  TableEmpty: typeof TableEmpty;
  SelectEmpty: typeof SelectEmpty;
  CustomTip: typeof CustomTip;
  Dropdown: typeof Dropdown;
};

const CustomTooltip = DefaultCustomTooltip as CompoundedComponent;

CustomTooltip.Paragraph = Paragraph;
CustomTooltip.Empty = Empty;
CustomTooltip.RichText = RichText;
CustomTooltip.FileNameEllipsis = FileNameEllipsis;
CustomTooltip.TableEmpty = TableEmpty;
CustomTooltip.SelectEmpty = SelectEmpty;
CustomTooltip.CustomTip = CustomTip;
CustomTooltip.Dropdown = Dropdown;

export default CustomTooltip;
