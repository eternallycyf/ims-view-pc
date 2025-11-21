import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface FileNameEllipsisProps {
  /**
   * 完整的文件名（包含扩展名）
   */
  fileName: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

const FileNameEllipsis = ({ fileName, className = '', style = {} }: FileNameEllipsisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState(fileName);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const calculateEllipsis = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      // 获取容器的实际可用宽度
      const containerWidth = container.offsetWidth;

      if (containerWidth === 0) {
        // 如果容器宽度为0，尝试延迟执行
        setTimeout(calculateEllipsis, 0);
        return;
      }

      // 分离文件名和扩展名
      const lastDotIndex = fileName.lastIndexOf('.');
      const hasExtension = lastDotIndex !== -1 && lastDotIndex !== 0;
      const nameWithoutExt = hasExtension ? fileName.slice(0, lastDotIndex) : fileName;
      const extension = hasExtension ? fileName.slice(lastDotIndex) : '';

      // 创建临时元素测量文本宽度
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.font = window.getComputedStyle(container).font;
      document.body.appendChild(tempSpan);

      // 测量完整文件名宽度
      tempSpan.textContent = fileName;
      const fullWidth = tempSpan.offsetWidth;

      // 如果不溢出，直接显示完整文件名
      if (fullWidth <= containerWidth) {
        setDisplayText(fileName);
        setIsOverflow(false);
        document.body.removeChild(tempSpan);
        return;
      }

      // 需要截断
      setIsOverflow(true);

      // 测量扩展名和省略号的宽度
      tempSpan.textContent = `...${extension}`;
      const suffixWidth = tempSpan.offsetWidth;

      // 可用于显示文件名的宽度
      const availableWidth = containerWidth - suffixWidth;

      if (availableWidth <= 0) {
        // 容器太小，只显示省略号和扩展名
        setDisplayText(`...${extension}`);
        document.body.removeChild(tempSpan);
        return;
      }

      // 二分查找最合适的截断位置
      let left = 0;
      let right = nameWithoutExt.length;
      let bestLength = 0;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        tempSpan.textContent = nameWithoutExt.slice(0, mid);
        const currentWidth = tempSpan.offsetWidth;

        if (currentWidth <= availableWidth) {
          bestLength = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      // 生成截断后的文本
      const truncatedName = nameWithoutExt.slice(0, bestLength);
      setDisplayText(`${truncatedName}...${extension}`);

      document.body.removeChild(tempSpan);
    };

    calculateEllipsis();

    // 监听容器自身大小变化
    const resizeObserver = new ResizeObserver(() => {
      calculateEllipsis();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [fileName]);

  return (
    <Tooltip title={isOverflow ? fileName : undefined}>
      <div
        ref={containerRef}
        className={` ${className}`}
        style={{
          width: '100%',
          display: 'block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          ...style,
        }}
      >
        {displayText}
      </div>
    </Tooltip>
  );
};

export default FileNameEllipsis;
