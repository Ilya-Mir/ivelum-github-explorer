import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query TestQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;
