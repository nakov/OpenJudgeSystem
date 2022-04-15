import React, { useMemo } from 'react';
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './DetailsIcon.module.scss';

import IconSize from './icon-sizes';
import Icon, { IIconProps } from './Icon';
import concatClassNames from '../../../utils/class-names';

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
