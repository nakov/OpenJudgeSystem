import React from 'react';
import { MdChevronRight } from 'react-icons/md';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface IMdChevronRightIconProps extends IIconProps{
}

const RightArrowIcon=({
    className='',
    size = IconSize.Medium,
    helperText = '',
}:IMdChevronRightIconProps) => (
    <Icon
        className={className}
        size={size}
        helperText={helperText}
        Component={MdChevronRight}
    />
);

export default RightArrowIcon;
