import cx from 'classnames';
import { AccessBtn, IButtonProps } from 'ims-view-pc';
import React, { Fragment } from 'react';
import './index.less';

export const renderBtn = (button: any) => {
  if (!button || !button.length) return null;
  const filterButton = button.filter((item: any) => {
    return item.visible || (item.visible && typeof item.visible === 'function' && item.visible());
  });

  if (!filterButton.length) return null;
  return (
    <Fragment>
      <AccessBtn btnList={filterButton} />
    </Fragment>
  );
};
interface ITableBtnProps {
  button: IButtonProps[];
  style?: React.CSSProperties;
}

class TableBtn extends React.PureComponent<ITableBtnProps, any> {
  render() {
    const { button, style } = this.props;
    return button && button.length > 0 ? (
      <div style={style} className="buttonRow">
        {renderBtn(button)}
      </div>
    ) : null;
  }
}

export default TableBtn;
