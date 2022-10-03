import React, { memo } from 'react';
import { DiRuby } from 'react-icons/di';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';

import styles from './StrategyIcon.module.scss';

interface IRubyIconProps extends IIconProps {
}


const RubyIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IRubyIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={DiRuby}
    />
);

export default memo(RubyIcon);
