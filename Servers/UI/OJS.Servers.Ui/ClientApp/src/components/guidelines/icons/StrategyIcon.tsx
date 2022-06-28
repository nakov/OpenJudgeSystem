import React, { useCallback } from 'react';
import {
    FaJava,
    FaPython,
    FaJs, FaHtml5,
} from 'react-icons/fa';
import IconSize from './icon-sizes';
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
            ? styles.localSmall
            : size === IconSize.Medium
                ? styles.localMedium
                : size === IconSize.Large
                    ? styles.localLarge
                    : styles.localExtraLarge;

    const iconClassName = concatClassNames(
        styles.localIcon,
        className,
    );

    const iconContainerClassName = concatClassNames(
        styles.localIconContainer,
        sizeClassName,
    );
    const renderHelperText = useCallback(
        () => {
            if (helperText === '') {
                return null;
            }
            return <span className={styles.localHelperText}>{helperText}</span>;
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
