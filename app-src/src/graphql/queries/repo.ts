import { gql } from '@apollo/client';

export const REPO_FILE = gql`
  query RepoFile($owner: String!, $name: String!, $expression: String!) {
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

export const REPOS_FILES = gql`
  query RepoFiles(
    $name: String!
    $owner: String!
    $expression: String = "master:"
  ) {
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        ... on Tree {
          entries {
            name
            oid
            type
          }
        }
      }
    }
  }
`;

export const REPOS_QUERY = gql`
  query GetPublicRepositories($login: String!) {
    user(login: $login) {
      repositories(
        first: 10
        isFork: false
        privacy: PUBLIC
        ownerAffiliations: OWNER
      ) {
        nodes {
          name
        }
      }
    }
  }
`;

export const REPO_MAIN_BRANCH = gql`
  query RepoMainBranch($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      defaultBranchRef {
        name
      }
    }
  }
`;
export const SEARCH_REPOS = gql`
  query SearchRepos($searchTerm: String!, $after: String) {
    search(query: $searchTerm, type: REPOSITORY, first: 10, after: $after) {
      edges {
        cursor
        node {
          ... on Repository {
            name
            owner {
              login
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
