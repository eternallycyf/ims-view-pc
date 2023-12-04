import { FC } from 'react';
import { IThemeEmptyProps } from './interface';

export const emptyImages = {
  Search:
    'raw.githubusercontent.com/eternallycyf/ims-view-pc/master/public/images/empty/search.png',
  Doc: 'raw.githubusercontent.com/eternallycyf/ims-view-pc/master/public/images/empty/doc.png',
  Upload:
    'raw.githubusercontent.com/eternallycyf/ims-view-pc/master/public/images/empty/upload.png',
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
