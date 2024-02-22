import { FaGithub } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IGithubIconProps = IIconProps

const GithubIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IGithubIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaGithub}
    />
);

export default GithubIcon;
