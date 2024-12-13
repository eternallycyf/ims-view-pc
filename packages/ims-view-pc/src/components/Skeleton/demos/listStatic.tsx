import { ProSkeleton } from 'ims-view-pc';

export default () => (
  <div
    style={{
      background: '#fafafa',
      padding: 24,
    }}
  >
    <ProSkeleton statistic={2} type="list" />
  </div>
);
