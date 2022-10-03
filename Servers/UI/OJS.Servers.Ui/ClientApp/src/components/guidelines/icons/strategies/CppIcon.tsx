import React, { memo } from 'react';
import { CgCPlusPlus } from 'react-icons/cg';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';

import styles from './StrategyIcon.module.scss';
import concatClassNames from '../../../../utils/class-names';

interface ICppIconProps extends IIconProps {
}

const CppIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ICppIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={CgCPlusPlus}
    />
);

export default memo(CppIcon);
