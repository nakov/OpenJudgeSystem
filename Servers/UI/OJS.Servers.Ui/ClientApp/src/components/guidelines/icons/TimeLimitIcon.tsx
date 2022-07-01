import React from 'react';
import { BiTime } from 'react-icons/all';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';
import concatClassNames from '../../../utils/class-names';
import styles from './TimeLimitIcon.module.scss';

interface IInProgressIconProps extends IIconProps {
}

const TimeLimitIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IInProgressIconProps) => (
    <Icon
      className={concatClassNames(styles.timeLimitIcon, className)}
      Component={BiTime}
      size={size}
      helperText={helperText}
    />
);

export default TimeLimitIcon;
