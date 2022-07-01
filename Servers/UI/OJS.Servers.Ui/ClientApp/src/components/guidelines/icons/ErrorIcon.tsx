import React from 'react';
import { MdError } from 'react-icons/md';
import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';
import styles from './ErrorIcon.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IErrorIconProps extends IIconProps {
}

const ErrorIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IErrorIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={MdError}
    />
);

export default ErrorIcon;
