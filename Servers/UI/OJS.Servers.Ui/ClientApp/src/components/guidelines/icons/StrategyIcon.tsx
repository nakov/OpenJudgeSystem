import React, { useCallback } from 'react';
import {
    FaJava,
    FaPython,
    FaJs, FaHtml5,
} from 'react-icons/fa';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';
import concatClassNames from '../../../utils/class-names';

import styles from './StrategyIcon.module.scss';

interface IProblemIconProps extends IIconProps {
}

const StrategyIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IProblemIconProps) => {
    const actualSize = size === IconSize.Small || size === IconSize.Medium
        ? IconSize.Small
        : size === IconSize.Large
            ? IconSize.Medium
            : IconSize.Large;

    const sizeClassName =
        size === IconSize.Small
            ? styles.small
            : size === IconSize.Medium
                ? styles.medium
                : size === IconSize.Large
                    ? styles.large
                    : styles.extraLarge;

    const iconClassName = concatClassNames(
        styles.icon,
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
            <div className={iconClassName}>
                <Icon
                  size={actualSize}
                  Component={FaPython}
                />
                <Icon
                  Component={FaJava}
                  size={actualSize}
                />
                <br />
                <Icon
                  Component={FaJs}
                  size={actualSize}
                />
                <Icon
                  Component={FaHtml5}
                  size={actualSize}
                />
            </div>
            {renderHelperText()}
        </div>
    );
};

export default StrategyIcon;
