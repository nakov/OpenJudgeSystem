import React from 'react';
import { MdExpandMore } from 'react-icons/md';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface IMdExpandMoreIconProps extends IIconProps{
}

const ExpandMoreIcon =({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IMdExpandMoreIconProps) =>(
    <Icon
        className={className}
        size={size}
        helperText={helperText}
        Component={MdExpandMore}
    />
);

export default ExpandMoreIcon;
