import { SEARCH_REPOS } from '../../graphql/queries/repo';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';

import './search.scss';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, fetchMore, loading } = useQuery(SEARCH_REPOS, {
    variables: { searchTerm },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        after: data.search.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          search: {
            ...fetchMoreResult.search,
            edges: [...prev.search.edges, ...fetchMoreResult.search.edges],
          },
        });
      },
    });
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search repositories..."
        className="search__input"
      />
      {data?.search.edges.length > 0 && (
        <div className="search__repos">
          {data?.search.edges.map((edge: SearchResultItemEdge) => {
            const {
              node: {
                name,
                owner: { login },
              },
            } = edge;
            return (
              <Link
                to={`/${login}/${name}/folder/`}
                className="search__repo"
                key={edge.cursor}
              >
                <FontAwesomeIcon icon={faArchive} />
                <div className="search__repo-name">{edge.node.name}</div>
              </Link>
            );
          })}
        </div>
      )}
      {loading ? (
        <div className="search__loading">
          <ReactLoading type={'bubbles'} color={'#12C413'} />
        </div>
      ) : (
        data?.search.pageInfo.hasNextPage && (
          <div className="search__load-more-wrapper">
            <button onClick={loadMore} className="search__load-more">
              Load more
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Search;
