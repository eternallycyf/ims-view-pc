import type { FC } from 'react';
const Empty: FC<{ symbol?: string }> = (props) => {
  const { symbol = '-' } = props;
  return <span style={{ color: '##00051D74' }}>{symbol}</span>;
};

export default Empty;
