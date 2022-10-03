import React, { memo } from 'react';
import { GrMysql } from 'react-icons/gr';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';
import styles from './StrategyIcon.module.scss';

interface IMySqlIconProps extends IIconProps {
}


const MySqlIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IMySqlIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={GrMysql}
    />
);

export default memo(MySqlIcon);
