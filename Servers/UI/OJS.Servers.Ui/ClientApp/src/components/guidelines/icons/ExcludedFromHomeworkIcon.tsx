import React, { memo } from 'react';
import { TbNorthStar } from 'react-icons/tb';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type ExcludedFromHomeworkIconProps = IIconProps

const ExcludedFromHomeworkIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ExcludedFromHomeworkIconProps) => (
    <Icon
      className={`icon ${className}`}
      size={size}
      helperText={helperText}
      Component={TbNorthStar}
    />
);

export default memo(ExcludedFromHomeworkIcon);
