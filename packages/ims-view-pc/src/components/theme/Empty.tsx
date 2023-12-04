import { FC } from 'react';
import { IThemeEmptyProps } from './interface';

export const emptyImages = {
  Search: 'https://raw.githubusercontent.com/eternallycyf/umi4-tab/main/public/empty/search.png',
  Doc: 'https://raw.githubusercontent.com/eternallycyf/umi4-tab/main/public/empty/doc.png',
  Upload: 'https://raw.githubusercontent.com/eternallycyf/umi4-tab/main/public/empty/upload.png',
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
