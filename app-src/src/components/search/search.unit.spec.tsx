import React from 'react';
import { fireEvent } from '@testing-library/react';

import Search from './index';
import customRender from '../../utils/render';

test('onChange updates search input value', async () => {
  const { getByPlaceholderText } = customRender(<Search />);

  const inputElement = getByPlaceholderText(/Search repositories.../i);

  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: 'test' } });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(inputElement.value).toBe('test');
});
