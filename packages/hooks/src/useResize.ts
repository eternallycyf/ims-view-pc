import React, { useEffect } from 'react';

const map = new WeakMap();
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    const handler = map.get(entry.target);
    if (handler) {
      handler(entry, { width, height });
    }
  }
});

interface IProps {
  node: React.RefObject<any>;
  cb: (entry: ResizeObserverEntry, size: { width: number; height: number }) => void;
}

const useResize = (props: IProps) => {
  const { node, cb } = props;
  useEffect(() => {
    ob.observe(node.current);
    map.set(node.current, cb);
    return () => {
      ob.unobserve(node.current);
    };
  }, []);
};

export default useResize;

// import useResize from './useResize';
// import React, { useRef } from 'react';
// const handelChange = (e, w) => {
//   console.log(e, w);
// };

// const IndexPage = () => {
//   const node = useRef(null);
//   const result = useResize({ node, cb: handelChange });

//   return (
//       <div ref={node}>sad</div>
//   );
// };

// export default IndexPage;
