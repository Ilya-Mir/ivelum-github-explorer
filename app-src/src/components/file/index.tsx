import React, { useEffect, useState } from 'react';
import { REPO_FILE, REPO_MAIN_BRANCH } from '../../graphql/queries/repo';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Highlight, themes } from 'prism-react-renderer';
import ErrorBlock from '../error';
import BackButton from '../back-button';
import './file.scss';

const File: React.FC = () => {
  const { repoName, userName, '*': filePath } = useParams();
  const [defaultBranchName, setDefaultBranchName] = useState('master');
  const [loadBranch, { data: branchData, loading: mainBranchLoading }] =
    useLazyQuery(REPO_MAIN_BRANCH);

  const [loadFile, { called, error, loading: fileLoading, data: fileData }] =
    useLazyQuery(REPO_FILE);

  useEffect(() => {
    loadBranch({
      variables: { name: repoName, owner: userName },
    });
  }, [loadBranch, repoName]);

  useEffect(() => {
    if (branchData?.repository?.defaultBranchRef?.name) {
      setDefaultBranchName(branchData.repository.defaultBranchRef.name);
    }
  }, [branchData, setDefaultBranchName]);

  useEffect(() => {
    if (repoName && filePath) {
      loadFile({
        variables: {
          owner: userName,
          name: repoName,
          expression: `${defaultBranchName}:${filePath}`,
        },
      });
    }
  }, [loadFile, repoName, filePath, defaultBranchName]);

  if ((called && fileLoading) || mainBranchLoading) {
    return (
      <div className="common__statements-wrapper">
        <ReactLoading type={'bubbles'} color={'#12C413'} />
      </div>
    );
  }

  const fileText = fileData?.repository?.object?.text;

  if (error || !fileText)
    return (
      <>
        <BackButton />
        <div className="common__statements-wrapper">
          <ErrorBlock message={error?.message || 'No data'} />
        </div>
      </>
    );
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <>
      <div className="filer__header">
        <BackButton />
        <div className="file__title">{filePath}</div>
      </div>
      <div className="file__container">
        <Highlight
          code={fileText}
          language="javascript"
          theme={themes.synthwave84}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
            <pre className={className} style={style}>
              {tokens.map((line: any, i: any) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token: any, key: any) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </>
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

export default File;
