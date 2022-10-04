import React, { memo } from 'react';
import { TbCSharp } from 'react-icons/tb';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';
import styles from './StrategyIcon.module.scss';

interface IDotNetIconProps extends IIconProps {
}


const DotNetIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IDotNetIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={TbCSharp}
    />
);

export default memo(DotNetIcon);
