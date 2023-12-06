import { QuestionCircleFilled, RetweetOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { CustomTheme } from '../../styles/customTheme';
import { IDefaultProps, IToggleBtnValue, IToggleButtonProps } from './interface';

const ToggleBtn = <T extends Record<string, IToggleBtnValue>>({
  status,
  setStatus,
  dict,
  cb,
}: IToggleButtonProps<T>) => {
  const currentDict: IToggleBtnValue = dict[status as any];
  const currentSize: IToggleBtnValue['size'] = currentDict?.size || 'small';
  const toggleDictStatus: string = Object.keys(dict).find((item) => item != status) as string;
  const otherDict: IToggleBtnValue = dict[toggleDictStatus];

  const defaultProps: IDefaultProps = {
    defaultHasTooltip: true,
    defaultToggleIcon: <RetweetOutlined />,
    defaultButtonStyle:
      currentDict.buttonType == 'primary'
        ? {}
        : { color: CustomTheme.blue, border: `1px solid ${CustomTheme.blue}`, background: '#fff' },
    defaultIconStyle: currentDict.buttonType == 'default' ? {} : { color: 'rgba(255,255,255,0.7)' },
  };

  return (
    <Button
      type={currentDict.buttonType}
      onClick={() => {
        if (setStatus) {
          setStatus(toggleDictStatus);
        } else {
          cb(toggleDictStatus);
        }
      }}
      icon={currentDict?.toggleIcon || defaultProps.defaultToggleIcon}
      size={currentSize}
      style={{ ...defaultProps.defaultButtonStyle, ...currentDict.buttonStyle }}
    >
      {otherDict.label}
      {(otherDict?.hasTooltip ?? defaultProps.defaultHasTooltip) && (
        <Tooltip title={otherDict?.tooltip || ''}>
          <QuestionCircleFilled
            style={{
              ...defaultProps.defaultIconStyle,
              ...currentDict.toggleIconStyle,
            }}
          />
        </Tooltip>
      )}
    </Button>
  );
};

export default ToggleBtn;
