import React from 'react';
import { FaDeezer } from 'react-icons/fa';
import IconSize from './icon-sizes';
import Icon, { IIconProps } from './Icon';

interface ISubmissionsPerMinuteIconProps extends IIconProps {
}

const SubmissionsPerMinuteIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ISubmissionsPerMinuteIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaDeezer}
    />
);

export default SubmissionsPerMinuteIcon;
