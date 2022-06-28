import React from 'react';
import { FaCode } from 'react-icons/fa';
import IconSize from './icon-sizes';
import Icon, { IIconProps } from './Icon';

interface ICodeIconProps extends IIconProps {
}

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
