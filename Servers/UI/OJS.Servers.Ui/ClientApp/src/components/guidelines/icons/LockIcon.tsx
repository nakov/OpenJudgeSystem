import React from 'react';
import { AiOutlineLock } from 'react-icons/all';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface ILockIconProps extends IIconProps {
}

const LockIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ILockIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={AiOutlineLock}
    />
);

export default LockIcon;
