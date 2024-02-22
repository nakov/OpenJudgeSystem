import { FaYoutube } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IYouTubeIconProps = IIconProps

const YouTubeIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IYouTubeIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaYoutube}
    />
);

export default YouTubeIcon;
