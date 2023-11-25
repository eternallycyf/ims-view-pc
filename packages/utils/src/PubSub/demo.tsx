import { createPubSub } from '@ims-view/utils';
import { useEffect } from 'react';

interface Record {
  name: string;
}
export const PubSub = createPubSub<{ handleOpenModal: (record: Record) => void }, Record>();

const Son = () => {
  useEffect(() => {
    PubSub.on('handleOpenModal', handleInitPage);
    return () => {
      PubSub.off('handleOpenModal', handleInitPage);
    };
  }, []);

  const handleInitPage = (record: Record) => {
    window.alert(JSON.stringify(record, null, 2));
  };
  return <div></div>;
};

const Father = () => {
  return (
    <div>
      <button
        type="submit"
        onClick={() => {
          // history.push('/father/son');
          setTimeout(function () {
            PubSub.emit('handleOpenModal', { name: 'zs' });
          }, 1000);
        }}
      >
        跨组件父传子
      </button>
      {/* 模拟跳转路由 忽略Father中的Son */}
      <Son />
    </div>
  );
};

export default Father;
