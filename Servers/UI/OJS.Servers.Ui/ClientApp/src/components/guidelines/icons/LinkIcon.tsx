import React from 'react';
import { FaLink } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IProblemIconProps = IIconProps

const FileIcon = ({
    className = '',
    size = IconSize.Small,
    helperText = '',
}: IProblemIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaLink}
    />
);

export default FileIcon;
