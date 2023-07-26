import React from 'react';
import { FaFileAlt } from 'react-icons/fa';

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
      Component={FaFileAlt}
    />
);

export default FileIcon;
