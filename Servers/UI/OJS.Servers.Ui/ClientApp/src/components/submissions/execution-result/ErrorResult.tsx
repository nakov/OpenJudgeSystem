import React from 'react';

import ErrorIcon from '../../guidelines/icons/ErrorIcon';

import styles from './ErrorResult.module.scss';

const ErrorResult = () => (
    <div>
        <ErrorIcon />
        <span className={styles.compileAndUnknownError}>
            {' '}
            Compile time error
        </span>
    </div>
);

export default ErrorResult;
