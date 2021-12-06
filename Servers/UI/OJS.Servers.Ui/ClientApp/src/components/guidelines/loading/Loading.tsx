import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './Loading.module.scss';

import { ReactComponent } from './Loading.svg';

interface ILoadingProps {
    isLoading: boolean,
}

const loadingRoot = document.createElement('div') as HTMLElement;

const Loading = ({ isLoading }:ILoadingProps) => {
    useEffect(() => {
        document.body.appendChild(loadingRoot);
        return () => {
            document.body.removeChild(loadingRoot);
        };
    }, []);

    if (isLoading) {
        return ReactDOM.createPortal(
            <div className={styles.loadingWrapper}>
                <div className={styles.loading}>
                    <ReactComponent className={styles.svg} />
                </div>
            </div>,
            loadingRoot,
        );
    }

    return null;
};

export default Loading;
