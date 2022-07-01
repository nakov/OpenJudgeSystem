import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './Loading.module.scss';

import { ReactComponent } from './Loading.svg';

interface ILoadingProps {
    isLoading: boolean;
    isWholePage?: boolean;
}

const loadingRoot = document.createElement('div') as HTMLElement;

const LoadingInternal = () => (
    <div className={styles.loadingWrapper}>
        <div className={styles.loading}>
            <ReactComponent className={styles.svg} />
        </div>
    </div>
);

const Loading = ({
    isLoading,
    isWholePage = false,
}: ILoadingProps) => {
    useEffect(() => {
        if (isWholePage) {
            return () => {
            };
        }

        document.body.appendChild(loadingRoot);

        return () => {
            document.body.removeChild(loadingRoot);
        };
    }, [ isWholePage ]);

    if (isWholePage) {
        return (
            <LoadingInternal />
        );
    }

    if (isLoading) {
        return ReactDOM.createPortal(
            (<LoadingInternal />),
            loadingRoot,
        );
    }

    return null;
};

export default Loading;
