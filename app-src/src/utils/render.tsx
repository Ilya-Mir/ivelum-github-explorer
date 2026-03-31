import React, { ReactElement, ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

interface ICustomRenderOptions extends RenderOptions {
  mocks?: MockedResponse[];
  addTypename?: boolean;
}

interface IWrapperProps {
  children?: ReactNode;
}

const customRender = (
  ui: ReactElement,
  { mocks = [], addTypename = false, ...options }: ICustomRenderOptions = {},
) => {
  const Wrapper: React.FC<IWrapperProps> = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={addTypename}>
      <MemoryRouter>{children}</MemoryRouter>
    </MockedProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export default customRender;
