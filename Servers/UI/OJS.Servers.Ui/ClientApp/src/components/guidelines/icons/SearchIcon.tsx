import React from 'react';
import { BsSearch } from 'react-icons/bs';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IExpandMoreIconProps = IIconProps

const SearchIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IExpandMoreIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={BsSearch}
    />
);

export default SearchIcon;
