import React from 'react';
import { AiOutlineLock } from 'react-icons/all';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';
import concatClassNames from '../../../utils/class-names';
import styles from './LockIcon.module.scss';

interface ILockIconProps extends IIconProps {
}

const LockIcon = ({
    className = '',
    containerClassName = '',
    size = IconSize.Small,
    helperText = '',
}: ILockIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      containerClassName={containerClassName}
      size={size}
      helperText={helperText}
      Component={AiOutlineLock}
    />
);

export default LockIcon;
