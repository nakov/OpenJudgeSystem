import React, { memo } from 'react';
import { GrGolang } from 'react-icons/gr';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';

import styles from './StrategyIcon.module.scss';
import concatClassNames from '../../../../utils/class-names';

interface IGoIconProps extends IIconProps {
}

const GoIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IGoIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={GrGolang}
    />
);

export default memo(GoIcon);
