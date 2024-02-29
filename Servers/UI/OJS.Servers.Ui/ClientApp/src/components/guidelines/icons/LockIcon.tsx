import { AiOutlineLock } from 'react-icons/ai';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type ILockIconProps = IIconProps

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
