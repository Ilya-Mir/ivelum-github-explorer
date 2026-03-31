import React from 'react';
import { cleanup } from '@testing-library/react';
import Folders from './index';
import customRender from '../../utils/render';
import { gql } from '@apollo/client';

const USER_QUERY = gql`
  query TestUserQuery {
    viewer {
      login
    }
  }
`;

const mockUserData = {
  viewer: {
    login: 'testUser',
  },
};

afterEach(cleanup);

test('Displays loading process while waiting for the data from queries', () => {
  customRender(<Folders />, {
    mocks: [
      {
        request: {
          query: USER_QUERY,
        },
        delay: 10000,
        result: {
          data: mockUserData,
        },
      },
    ],
  });

  expect(
    document.querySelector('.common__statements-wrapper'),
  ).toBeInTheDocument();
});
