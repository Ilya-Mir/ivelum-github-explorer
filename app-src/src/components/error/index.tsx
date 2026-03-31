import React from 'react';
import './error.scss';

interface IError {
  message?: string;
}

const ErrorBlock: React.FC<IError> = ({ message }) => {
  return <div className="error__wrapper">Error: {message}</div>;
};

export default ErrorBlock;
