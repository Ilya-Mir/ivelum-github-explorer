import React from 'react';
import { REPO_MAIN_BRANCH, REPOS_FILES } from '../../graphql/queries/repo';
import { USER_QUERY } from '../../graphql/queries/user';
import customRender from '../../utils/render';
import Folder from './index';
import { useParams } from 'react-router-dom';
import clearAllMocks = jest.clearAllMocks;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

beforeEach(() => {
  clearAllMocks();
});
const mockUserData = {
  viewer: {
    login: 'mockUser',
  },
};

const mockBranchData = {
  repository: {
    defaultBranchRef: {
      name: 'mockBranch',
    },
  },
};

const mockReposData = {
  repository: {
    object: {
      entries: [
        { name: 'mockEntry1', type: 'tree' },
        { name: 'mockEntry2', type: 'blob' },
      ],
    },
  },
};

test('Renders files and folders on successful queries', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useParams.mockReturnValue({
    owner: 'mockUser',
    repoName: 'mockRepoName',
    '*': 'master:',
  });

  customRender(<Folder />, {
    mocks: [
      {
        request: {
          query: USER_QUERY,
        },
        result: {
          data: mockUserData,
        },
      },
      {
        request: {
          query: REPO_MAIN_BRANCH,
          variables: { name: 'mockRepoName', owner: 'mockUser' },
        },
        result: {
          data: mockBranchData,
        },
      },
      {
        request: {
          query: REPOS_FILES,
          variables: {
            owner: 'mockUser',
            name: 'mockRepoName',
            expression: 'mockBranch:',
          },
        },
        result: {
          data: mockReposData,
        },
      },
    ],
  });

  const errorElement = await document.querySelector(
    '.common__statements-wrapper',
  );
  expect(errorElement).toBeInTheDocument();
});
