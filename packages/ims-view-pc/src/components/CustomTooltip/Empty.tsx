import type { FC } from 'react';
const Empty: FC<{ symbol?: string }> = (props) => {
  const { symbol = '--' } = props;
  return <span style={{ color: '#8E96A4' }}>{symbol}</span>;
};

export default Empty;
