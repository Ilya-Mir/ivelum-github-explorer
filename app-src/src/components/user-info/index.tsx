import React from 'react';
import ReactLoading from 'react-loading';
import './user-info.scss';
import ErrorBlock from '../error';
import { useQuery } from '@apollo/client';
import { USER_QUERY } from '../../graphql/queries/user';

const UserInfo: React.FC = () => {
  const { loading, error, data } = useQuery(USER_QUERY);

  if (loading) return <ReactLoading type={'bubbles'} color={'#12C413'} />;
  if (error) return <ErrorBlock message={error.message} />;

  const { viewer } = data;

  return (
    <div className="user-info__container">
      <a
        className="user-info__name"
        href={`https://github.com/${viewer?.login}`}
        target="_blank"
        rel="noreferrer"
      >
        {viewer?.login}
      </a>
      {viewer?.avatarUrl && (
        <div className="user-info__ava-wrapper">
          <img className="user-info__ava" src={viewer?.avatarUrl} alt="Ava" />
        </div>
      )}
    </div>
  );
};

export default UserInfo;
