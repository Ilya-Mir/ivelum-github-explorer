import React from 'react';
import { gql } from '@apollo/client';
import { screen, cleanup } from '@testing-library/react';
import UserInfo from './index';
import customRender from '../../utils/render';

const USER_QUERY = gql`
  query TestQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;

const mockData = {
  viewer: {
    login: 'mockUser',
    avatarUrl: 'mockUrl',
  },
};

const mockError = new Error('An error happened!');

afterEach(cleanup);

test('renders user information', async () => {
  customRender(<UserInfo />, {
    mocks: [
      {
        request: {
          query: USER_QUERY,
        },
        result: {
          data: mockData,
        },
      },
    ],
  });

  const userNameElement = await screen.findByText('mockUser');

  expect(userNameElement).toBeInTheDocument();
  expect(screen.getByAltText('Ava')).toHaveAttribute('src', 'mockUrl');
});

test('renders error message on failure', async () => {
  customRender(<UserInfo />, {
    mocks: [
      {
        request: {
          query: USER_QUERY,
        },
        error: mockError,
      },
    ],
  });

  expect(await screen.findByText(/An error happened!/i)).toBeInTheDocument();
});
