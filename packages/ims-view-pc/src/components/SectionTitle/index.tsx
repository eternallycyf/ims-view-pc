import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React, { FC } from 'react';
import { variables } from '../../styles/variables';
import './index.less';
import { ISectionTitle } from './interface';

export const renderTooltip = (
  tooltip: React.ReactNode = '',
  props: ISectionTitle['tooltipProps'],
) => {
  return (
    <div>
      <Tooltip title={tooltip} overlayInnerStyle={{ maxWidth: 700 }} {...props}>
        <QuestionCircleOutlined
          style={{
            marginLeft: 6,
            fontSize: 12,
            color: 'rgb(153,153,153)',
          }}
        />
      </Tooltip>
    </div>
  );
};

const SectionTitle: FC<ISectionTitle> = (props) => {
  const {
    title,
    extraContent = '',
    rowStyle = {},
    titleStyle = {},
    tooltip,
    tooltipProps,
    children,
  } = props;
  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        className={title != undefined ? 'SectionTitle' : 'default-SectionTitle'}
        style={{ ...rowStyle, '--primary-color': variables.colorPrimary }}
      >
        <Col className="SectionTitle-title" style={titleStyle}>
          {title}
          {tooltip && renderTooltip(tooltip, tooltipProps)}
        </Col>
        <Col>{extraContent}</Col>
      </Row>
      {children}
    </>
  );
};

export default SectionTitle;
