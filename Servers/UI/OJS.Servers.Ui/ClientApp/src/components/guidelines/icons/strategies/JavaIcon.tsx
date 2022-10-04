import React, { memo } from 'react';
import { FaJava } from 'react-icons/fa';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';
import styles from './StrategyIcon.module.scss';

interface IJavaIconProps extends IIconProps {
}


const JavaIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IJavaIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={FaJava}
    />
);

export default memo(JavaIcon);
