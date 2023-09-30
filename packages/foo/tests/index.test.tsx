import { render } from '@testing-library/react';

import Bar from '@ims-view/bar';
import React from 'react';

test('Bar', () => {
  const { container } = render(<Bar />);

  expect(container).toMatchSnapshot();
});
