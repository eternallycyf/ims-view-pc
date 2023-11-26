import { Button, message } from 'antd';
import { CustomModal } from 'ims-view-pc';

const Base = () => {
  const handleClick = () => {
    CustomModal({
      type: 'confirm',
      footerBtns: [],
      modalProps: {
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (Math.random() > 0.5) {
                message.success('成功');
                resolve({});
              } else {
                message.error('失败');
                reject();
              }
            }, 1000);
          });
        },
      },
    });
  };
  return <Button onClick={handleClick}>模态框</Button>;
};

export default Base;
