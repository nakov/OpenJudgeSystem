import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Icon, { IIconProps } from './Icon';
import IconSize from './icon-sizes';
import concatClassNames from '../../../utils/class-names';
import styles from './TickIcon.module.scss';

interface ITickIconProps extends IIconProps {
}

const TickIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: ITickIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={FaCheckCircle}
    />
);

export default TickIcon;
