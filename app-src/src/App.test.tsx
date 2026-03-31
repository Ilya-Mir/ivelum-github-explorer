import React from 'react';
import { gql } from '@apollo/client';
import App from './App';
import customRender from './utils/render';

const QUERY = gql`
  query MyQuery {
    currentUser {
      firstName
    }
  }
`;

const mocks = [
  {
    request: {
      query: QUERY,
      variables: {},
    },
    result: {
      data: {
        currentUser: {
          firstName: 'John',
        },
      },
    },
  },
];

test('renders the App component without crashing', () => {
  customRender(<App />, { mocks });
  const headerElement = document.querySelector('.App__enter');
  const navigationDiv = document.querySelector('.App__user');
  expect(headerElement).toBeInTheDocument();
  expect(navigationDiv).toBeInTheDocument();
});
