import { Avatar, Button, Card } from 'antd';
import { CommonCard, ICardListHandle } from 'ims-view-pc';
import _ from 'lodash';
import React, { Fragment } from 'react';
const { CardList } = CommonCard;

interface IRecord {
  title: string;
  desc: string;
}

interface IApi {
  code: number;
  data: {
    list: IRecord[];
  };
}

const App = () => {
  const CardRef = React.useRef<ICardListHandle<IRecord>>(null!);
  const [num, setNum] = React.useState<number>(0);

  const handleRefreshPage = async () => {
    const data = await CardRef.current?.fetchData({ aaa: 1 }, { bbb: 2 });
  };

  const handleRefreshPage2 = async () => {
    setNum(num + 1);
  };

  return (
    <Fragment>
      <Button onClick={_.debounce(handleRefreshPage, 700)}>刷新1</Button>
      <Button onClick={_.debounce(handleRefreshPage2, 700)}>刷新2</Button>
      <CardList<IRecord>
        request={() => {
          return new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  data: {
                    list: Array.from({ length: 10 }).map((item) => ({ title: '123', desc: '123' })),
                  },
                }),
              1000,
            );
          });
        }}
        ref={CardRef}
        fetchConfig={{
          apiUrl: '/getActivityList',
          params: { kw: '123' },
          data: { record: '123' },
          method: 'get',
          dataPath: 'data.list',
          depts: [num],
        }}
        title="标题"
        extra={<Button type="link">关注</Button>}
        renderItem={(item, index) => (
          <Card.Meta
            avatar={
              <Avatar
                size={48}
                src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
              />
            }
            title={item?.title ?? '--'}
            description={item?.desc ?? '--'}
          />
        )}
      />
    </Fragment>
  );
};

export default App;
