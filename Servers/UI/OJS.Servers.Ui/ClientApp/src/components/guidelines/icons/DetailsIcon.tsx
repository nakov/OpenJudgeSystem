import React, { useMemo } from 'react';
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md';

import concatClassNames from '../../../utils/class-names';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

import styles from './DetailsIcon.module.scss';

interface IInProgressIconProps extends IIconProps {
    isOpen?: boolean;
}

const DetailsIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
    isOpen = false,
}: IInProgressIconProps) => {
    const Component = useMemo(
        () => (isOpen
            ? MdOutlineExpandLess
            : MdOutlineExpandMore),
        [ isOpen ],
    );

    return (
        <Icon
          className={concatClassNames(styles.icon, className)}
          size={size}
          helperText={helperText}
          Component={Component}
        />
    );
};

export default DetailsIcon;
