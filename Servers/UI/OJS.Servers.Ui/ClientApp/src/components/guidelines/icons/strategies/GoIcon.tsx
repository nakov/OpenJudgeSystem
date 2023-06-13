import React, { memo } from 'react';
import GoLogo from './GoLogo';

import concatClassNames from '../../../../utils/class-names';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';

import styles from './StrategyIcon.module.scss';

type IGoIconProps = IIconProps

const GoIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IGoIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={GoLogo}
    />
);

export default memo(GoIcon);
