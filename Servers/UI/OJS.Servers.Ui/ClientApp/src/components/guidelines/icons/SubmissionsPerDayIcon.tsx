import React from 'react';
import { FaDeezer } from 'react-icons/fa';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface ISubmissionsPerDayIconProps extends IIconProps {
}

const SubmissionsPerDayIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ISubmissionsPerDayIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaDeezer}
    />
);

export default SubmissionsPerDayIcon;
