import { variables } from 'ims-view-pc';
import './index.less';

const Line = () => (
  <>
    <div className="line" style={{ '--primary-bg-color': variables?.colorPrimaryBg }} />
    <div style={{ padding: '0 16px', paddingTop: 8 }} />
  </>
);

export default Line;
