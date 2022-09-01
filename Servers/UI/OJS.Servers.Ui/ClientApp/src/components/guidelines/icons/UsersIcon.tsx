import React from 'react';
import { FaUsers } from 'react-icons/fa';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface IUsersIconProps extends IIconProps {
}

const UsersIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IUsersIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaUsers}
    />
);

export default UsersIcon;
