import { Portal } from 'ims-view-pc';
import React, { useEffect, useRef } from 'react';

export default () => {
  const containerRef = useRef<HTMLElement>(null);

  const content = (
    <div className="btn">
      <button type="button">按钮</button>
    </div>
  );

  useEffect(() => {
    console.log(containerRef);
  }, []);

  return (
    <div>
      <Portal attach={document.body} ref={containerRef}>
        {content}
      </Portal>
    </div>
  );
};
