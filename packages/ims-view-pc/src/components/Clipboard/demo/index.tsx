import { Clipboard } from 'ims-view-pc';
export default () => {
  return (
    <Clipboard text="Clipboard Text" onCopy={() => console.log('copy')}>
      <div>复制</div>
    </Clipboard>
  );
};
