import React, { memo } from 'react';
import { SiMicrosoftsqlserver } from 'react-icons/si';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';
import styles from './StrategyIcon.module.scss';

interface ISqlServerIconProps extends IIconProps {
}


const SqlServerIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ISqlServerIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={SiMicrosoftsqlserver}
    />
);

export default memo(SqlServerIcon);
