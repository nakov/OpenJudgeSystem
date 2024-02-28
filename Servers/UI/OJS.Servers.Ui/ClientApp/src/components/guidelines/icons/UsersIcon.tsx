import { FaUsers } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IUsersIconProps = IIconProps

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
