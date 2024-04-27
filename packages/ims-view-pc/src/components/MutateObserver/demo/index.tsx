import { MutateObserver } from 'ims-view-pc';
import { useEffect, useState } from 'react';

export default function App() {
  const [className, setClassName] = useState('aaa');

  useEffect(() => {
    setTimeout(() => setClassName('bbb'), 2000);
  }, []);

  const callback = function (mutationsList: MutationRecord[]) {
    console.log(mutationsList);
  };

  return (
    <div>
      <MutateObserver onMutate={callback}>
        <div id="container">
          <div className={className}>
            {className === 'aaa' ? (
              <div>aaa</div>
            ) : (
              <div>
                <p>bbb</p>
              </div>
            )}
          </div>
        </div>
      </MutateObserver>
    </div>
  );
}
