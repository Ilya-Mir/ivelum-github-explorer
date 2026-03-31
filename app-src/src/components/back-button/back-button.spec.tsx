import React from 'react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import customRender from '../../utils/render';
import BackButton from './index';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: jest.fn().mockImplementation(() => <div>Fake Icon</div>),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('Clicking back button navigates to previous page', async () => {
  customRender(<BackButton />);

  const button = document.querySelector('.back-button');

  expect(button).toBeInTheDocument();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fireEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith(-1);
});
