import React from 'react';
import {
  REPO_FILE,
  REPO_MAIN_BRANCH,
  REPOS_FILES,
  REPOS_QUERY,
} from '../../graphql/queries/repo';
import customRender from '../../utils/render';
import { USER_QUERY } from '../../graphql/queries/user';
import Folders from './index';
import { waitFor, screen } from '@testing-library/react';

const mockUserData2 = {
  viewer: {
    login: 'testUser',
  },
};

const mockRepoData = {
  user: {
    repositories: {
      nodes: [{ name: 'repo1' }, { name: 'repo2' }],
    },
  },
};

const mockRepoFileData = {
  repository: {
    object: {
      text: 'mockFileText',
    },
  },
};

const mockRepoFilesData = {
  repository: {
    object: {
      entries: [{ name: 'mockFile1' }, { name: 'mockFile2' }],
    },
  },
};

const mockRepoMainBranchData = {
  repository: {
    defaultBranchRef: {
      name: 'mockBranchName',
    },
  },
};

test('Displays user folders on successful queries', async () => {
  customRender(<Folders />, {
    mocks: [
      {
        request: {
          query: USER_QUERY,
        },
        result: {
          data: mockUserData2,
        },
      },
      {
        request: {
          query: REPOS_QUERY,
          variables: { login: mockUserData2.viewer.login },
        },
        result: {
          data: mockRepoData,
        },
      },
      {
        request: {
          query: REPO_FILE,
          variables: { owner: 'testUser', name: 'repo1', expression: 'master' },
        },
        result: {
          data: mockRepoFileData,
        },
      },
      {
        request: {
          query: REPOS_FILES,
          variables: { name: 'repo1', owner: 'testUser', expression: 'master' },
        },
        result: {
          data: mockRepoFilesData,
        },
      },
      {
        request: {
          query: REPO_MAIN_BRANCH,
          variables: { name: 'repo1', owner: 'testUser' },
        },
        result: {
          data: mockRepoMainBranchData,
        },
      },
    ],
  });

  await waitFor(async () => {
    expect(await screen.findByText('repo1')).toBeInTheDocument();
    expect(await screen.findByText('repo2')).toBeInTheDocument();
  });
});
