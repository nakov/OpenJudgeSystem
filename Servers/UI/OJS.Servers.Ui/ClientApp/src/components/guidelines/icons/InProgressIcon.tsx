import React, { useCallback } from 'react';
import { MdOutlineNetworkWifi } from 'react-icons/md';
import { IHaveOptionalClassName } from '../../common/Props';
import concatClassNames from '../../../utils/class-names';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './Icons.module.scss';
import IconSize from './icon-sizes';

interface IInProgressIconProps extends IHaveOptionalClassName {
    size?: IconSize;
    helperText?: string;
}

const InProgressIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IInProgressIconProps) => {
    const sizeClassName =
        size === IconSize.Small
            ? styles.small
            : size === IconSize.Medium
                ? styles.medium
                : styles.large;

    const iconClassName = concatClassNames(
        styles.icon,
        styles.inProgress,
        className,
    );

    const iconContainerClassName = concatClassNames(
        styles.iconContainer,
        sizeClassName,
    );

    const renderHelperText = useCallback(
        () => {
            if (helperText === '') {
                return null;
            }
            return <span className={styles.helperText}>{helperText}</span>;
        },
        [ helperText ],
    );

    return (
        <div className={iconContainerClassName}>
            <MdOutlineNetworkWifi
              className={iconClassName}
            />
            {renderHelperText()}
        </div>
    );
};

export default InProgressIcon;
