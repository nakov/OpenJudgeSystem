import React, { memo } from 'react';

import concatClassNames from '../../../../utils/class-names';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';

import PostgreSqlLogo from './PostgreSqlLogo';

import styles from './StrategyIcon.module.scss';

type IPostgreSqlIconProps = IIconProps

const PostgreSqlIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IPostgreSqlIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={PostgreSqlLogo}
    />
);

export default memo(PostgreSqlIcon);
