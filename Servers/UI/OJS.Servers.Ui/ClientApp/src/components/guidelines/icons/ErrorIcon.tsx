import React from 'react';
import { MdError } from 'react-icons/md';
import IconSize from './icon-sizes';
import Icon, { IIconProps } from './Icon';
import styles from './ErrorIcon.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IInProgressIconProps extends IIconProps {
}

const InProgressIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IInProgressIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={MdError}
    />
);

export default InProgressIcon;
