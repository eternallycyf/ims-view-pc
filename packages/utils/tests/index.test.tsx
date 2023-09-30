import { render } from '@testing-library/react';

import Hooks from '@ims-view/hooks';
import React from 'react';

test('Hooks', () => {
  const { container } = render(<Hooks />);

  expect(container).toMatchSnapshot();
});
