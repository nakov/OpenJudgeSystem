import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IHaveOptionalClassName } from '../../common/Props';
import concatClassNames from '../../../utils/class-names';
import styles from './Icons.module.scss';
import IconSize from './icon-sizes';

interface ITickIconProps extends IHaveOptionalClassName {
    size?: IconSize;
}

const TickIcon = ({
    className = '',
    size = IconSize.Medium,
}: ITickIconProps) => {
    const sizeClassName =
        size === IconSize.Small
            ? styles.small
            : size === IconSize.Medium
                ? styles.medium
                : styles.large;

    const iconClassName = concatClassNames(
        styles.icon,
        styles.success,
        className,
    );

    const iconContainerClassName = concatClassNames(
        styles.iconContainer,
        sizeClassName,
    );

    return (
        <div className={iconContainerClassName}>
            <FaCheckCircle
              className={iconClassName}
            />
        </div>
    );
};

export default TickIcon;
