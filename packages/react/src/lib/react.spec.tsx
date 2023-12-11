import { render } from '@testing-library/react';

import { SlateToReact } from '../lib/react';

describe('React', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SlateToReact node={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
