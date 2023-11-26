import { Button } from 'antd';
import { CustomModal } from 'ims-view-pc';

const App = () => {
  const handleClick = () => {
    CustomModal({
      title: 'xxx',
      content: 'xxx',
      footerBtns: [
        {
          btnProps: { type: 'primary' },
          code: true,
          btnChild: '知道了',
        },
      ],
      modalProps: {
        width: 800,
      },
    });
  };

  return <Button onClick={handleClick}>模态框</Button>;
};

export default App;
