import React from 'react';
import { FaCode } from 'react-icons/fa';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type ICodeIconProps = IIconProps

const CodeIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ICodeIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaCode}
    />
);

export default CodeIcon;
