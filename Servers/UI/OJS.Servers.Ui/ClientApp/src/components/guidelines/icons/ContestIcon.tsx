import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

interface IContestIconProps extends IIconProps {
}

const ContestIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IContestIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={FaTrophy}
    />
);

export default ContestIcon;
