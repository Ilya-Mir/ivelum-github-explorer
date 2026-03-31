import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';
import './folders.scss';
import ErrorBlock from '../error';
import { useLazyQuery, useQuery } from '@apollo/client';
import { REPOS_QUERY } from '../../graphql/queries/repo';
import { USER_QUERY } from '../../graphql/queries/user';
import { IRepository } from '../../types/repository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Folders: React.FC = () => {
  const { loading: userLoading, data: userData } = useQuery(USER_QUERY);

  const [getRepos, { loading, data: reposAnswer, error }] =
    useLazyQuery(REPOS_QUERY);

  const isLoading = userLoading || loading;

  useEffect(() => {
    if (userData?.viewer?.login) {
      getRepos({ variables: { login: userData.viewer.login } });
    }
  }, [userData, getRepos]);

  if (isLoading)
    return (
      <div className="common__statements-wrapper">
        <ReactLoading type={'bubbles'} color={'#12C413'} />
      </div>
    );

  if (!reposAnswer) return null;

  const {
    user: {
      repositories: { nodes: repositories },
    },
  } = reposAnswer;

  if (error)
    return (
      <div className="common__statements-wrapper">
        <ErrorBlock message={error.message} />
      </div>
    );

  return (
    <div className="folders__container">
      {repositories.map((repository: IRepository) => {
        const { name } = repository;
        return (
          <Link className="folders__folder" to={`/${name}/folder/`} key={name}>
            <FontAwesomeIcon icon={faArchive} />
            <div className="folders__name">{name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default Folders;
