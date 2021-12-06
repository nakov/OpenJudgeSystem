import * as React from 'react';
import styles from './Label.module.scss';

interface ITagProps {
    text: string;
    type: 'success' | 'danger' | 'warning';
}

const Tag = ({ text, type }: ITagProps) => {
    const className =
        type === 'success'
            ? styles.tagSuccess
            : type === 'warning'
                ? styles.tagWarning
                : styles.tagDanger;

    return (
        <div className={className}>
            {text}
        </div>
    );
};

export default Tag;
