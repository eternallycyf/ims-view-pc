import { FC } from 'react';
import { IThemeEmptyProps } from './interface';

export const emptyImages = {
  Search:
    'data:image/png;base64,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',
  Doc: 'data:image/png;base64,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',
  Upload:
    'data:image/png;base64,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',
};

const Empty: FC<IThemeEmptyProps> = (props) => {
  const { src, name } = props;
  return (
    <>
      <img src={src} alt={name} />
    </>
  );
};

export default Empty;