import React from 'react';
import { AiOutlineLock } from 'react-icons/all';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface ILockIconProps extends IIconProps {
}

const LockIcon = ({
    className = '',
    containerClassName = '',
    size = IconSize.Medium,
    helperText = '',
}: ILockIconProps) => (
    <Icon
      className={className}
      containerClassName={containerClassName}
      size={size}
      helperText={helperText}
      Component={AiOutlineLock}
    />
);

export default LockIcon;
