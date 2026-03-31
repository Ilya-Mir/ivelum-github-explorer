import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import File from './index';
import { useParams } from 'react-router-dom';
import { REPO_FILE, REPO_MAIN_BRANCH } from '../../graphql/queries/repo';
import { USER_QUERY } from '../../graphql/queries/user';
import customRender from '../../utils/render';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

test('Renders file on successful queries', async () => {
  const REPO_FILE_MOCK = {
    request: {
      query: REPO_FILE,
      variables: {
        owner: 'mockUser',
        name: 'mockRepoName',
        expression: 'mockBranch:mockFilePath',
      },
    },
    result: {
      data: { repository: { object: { text: 'mockFileText' } } },
    },
  };

  const REPO_MAIN_BRANCH_MOCK = {
    request: {
      query: REPO_MAIN_BRANCH,
      variables: { name: 'mockRepoName', owner: 'mockUser' },
    },
    result: {
      data: { repository: { defaultBranchRef: { name: 'mockBranch' } } },
    },
  };

  const USER_QUERY_MOCK = {
    request: {
      query: USER_QUERY,
    },
    result: {
      data: { viewer: { login: 'mockUser' } },
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useParams.mockReturnValue({
    repoName: 'mockRepoName',
    '*': 'mockFilePath',
  });

  customRender(<File />, {
    mocks: [USER_QUERY_MOCK, REPO_MAIN_BRANCH_MOCK, REPO_FILE_MOCK],
  });

  const errorElement = await document.querySelector(
    '.common__statements-wrapper',
  );

  expect(errorElement).toBeInTheDocument();
});
