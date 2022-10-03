import React, { memo } from 'react';
import { FaPhp } from 'react-icons/fa';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';

import styles from './StrategyIcon.module.scss';

interface IPhpIconProps extends IIconProps {
}


const PhpIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IPhpIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={FaPhp}
    />
);

export default memo(PhpIcon);
