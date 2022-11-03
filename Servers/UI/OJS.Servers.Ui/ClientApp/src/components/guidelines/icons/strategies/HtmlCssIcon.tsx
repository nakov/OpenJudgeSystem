import React, { memo } from 'react';
import { GrHtml5 } from 'react-icons/gr';

import concatClassNames from '../../../../utils/class-names';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';

import styles from './StrategyIcon.module.scss';

type IHtmlCssIconProps = IIconProps

const HtmlCssIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IHtmlCssIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={GrHtml5}
    />
);

export default memo(HtmlCssIcon);
