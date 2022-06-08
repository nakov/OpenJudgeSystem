import React from 'react';
import { BiMemoryCard } from 'react-icons/all';
import IconSize from './icon-sizes';
import Icon, { IIconProps } from './Icon';

interface IMemoryIconProps extends IIconProps {
}

const MemoryIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IMemoryIconProps) => (
    <Icon
      className={className}
      Component={BiMemoryCard}
      size={size}
      helperText={helperText}
    />
);

export default MemoryIcon;
