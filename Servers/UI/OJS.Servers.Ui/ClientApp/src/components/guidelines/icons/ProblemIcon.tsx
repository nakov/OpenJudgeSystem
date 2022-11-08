import React from 'react';
import { FaPuzzlePiece } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IProblemIconProps = IIconProps

const ProblemIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IProblemIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaPuzzlePiece}
    />
);

export default ProblemIcon;
