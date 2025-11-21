import { variables } from 'ims-view-pc';
import lodash from 'lodash';
import { useEffect } from 'react';
import FileImage from '../FileUpload/FileImage';
import CustomTooltip from './';
import Empty from './Empty';
import type { ParagraphProps } from './Paragraph';

interface FileNameProps {
  name: string;
  /**
   * @name 是否为链接
   */
  isLink?: boolean;
  icon?: React.ReactNode;
  /**
   * @name 是否显示图标
   */
  showIcon?: boolean;
  onClick?: () => any;
  /**
   * @name 文件名类名
   */
  className?: string;
  /**
   * @name 容器类名
   */
  wrapperClassName?: string;
  iconClassName?: string;
  /**
   * @name 容器样式
   */
  wrapperStyle?: React.CSSProperties;
  /**
   * @name 文件名样式
   */
  style?: React.CSSProperties;
  ParagraphProps?: ParagraphProps;
}

const FileName = (props: FileNameProps) => {
  const {
    name,
    wrapperClassName,
    wrapperStyle,
    iconClassName,
    className,
    style,
    isLink = false,
    showIcon = true,
    ParagraphProps,
    icon,
    onClick,
  } = props;

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (lodash.isNil(name) || (typeof name === 'string' && name?.length === 0)) {
    return <Empty />;
  }

  const fileType =
    name?.lastIndexOf('.') !== -1 ? name?.slice(name?.lastIndexOf('.') + 1) : undefined;

  if (!fileType) return <Empty />;

  return (
    <div
      className={`${wrapperClassName}`}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: isLink ? 'pointer' : 'default',
        ...wrapperStyle,
      }}
      onClick={onClick}
    >
      {showIcon && (
        <>
          {icon || (
            <FileImage
              style={{
                marginRight: '4px',
                height: '17px',
                width: '17px',
                flexShrink: 0,
                lineHeight: 1,
              }}
              className={iconClassName}
              fileName={name}
            />
          )}
        </>
      )}

      <div className="min-w-0 flex-1">
        <CustomTooltip.FileNameEllipsis
          fileName={name}
          {...ParagraphProps}
          className={`${ParagraphProps?.className} ${className}`}
          style={{
            width: '100%',
            cursor: isLink ? 'pointer' : 'default',
            color: isLink ? variables.colorLink : undefined,
            ...style,
            ...ParagraphProps?.style,
          }}
        />
      </div>
    </div>
  );
};

export default FileName;
