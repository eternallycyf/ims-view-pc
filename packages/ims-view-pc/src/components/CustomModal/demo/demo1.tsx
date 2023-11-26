import { Button } from 'antd';
import { CustomModal } from 'ims-view-pc';

const Base = () => {
  const handleClick = () => {
    CustomModal({
      title: '完成确认',
      content: `xxxx`,
      onOk: (status, destoryFn) => {
        console.log(status, destoryFn);
        destoryFn();
      },
    });
  };
  return <Button onClick={handleClick}>模态框</Button>;
};

export default Base;
