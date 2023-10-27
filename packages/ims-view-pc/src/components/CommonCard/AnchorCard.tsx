import { Anchor, Col, Row } from 'antd';
import { variables as defaultVariables } from 'ims-view-pc';
import React from 'react';
import './index.less';
import { ICommonCardAnchorCardProps } from './interface';
const { Link } = Anchor;

function AnchorCard<Values extends string>(
  props: ICommonCardAnchorCardProps<Values>,
): React.ReactElement {
  const { btnList = [], rightChildren, children, id = 'anchorContent' } = props;
  const variables = {
    '--primary-bg-color': defaultVariables.colorPrimaryBg,
    '--primary-color': defaultVariables.colorPrimary,
    '--primary-color-hover': defaultVariables.colorPrimaryHover,
    '--primary-color-active': defaultVariables.colorPrimaryActive,
  };

  return (
    <div className="AnchorCard" style={variables}>
      <Anchor
        offsetTop={20}
        className="anchorName"
        getContainer={() => document.querySelector(`#${id}`) as HTMLElement}
      >
        <Row
          style={{ width: '100%', padding: '0 24px 12px 16px' }}
          justify="space-between"
          align="middle"
        >
          <Col style={{ display: 'flex' }}>
            {(btnList || []).map((item, index) => (
              <Link key={index} href={`#${item?.value}`} title={item?.label} />
            ))}
          </Col>
          {rightChildren && <Col>{rightChildren}</Col>}
        </Row>
      </Anchor>
      <div id={id} className="anchorContent">
        {children}
      </div>
    </div>
  );
}

export default AnchorCard;
