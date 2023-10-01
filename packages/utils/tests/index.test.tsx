import { render } from '@testing-library/react';

import Utils from '@ims-view/utils';
import React from 'react';

test('Utils', () => {
  const { container } = render(<Utils />);

  expect(container).toMatchSnapshot();
});
