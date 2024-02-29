import { MdOutlineNetworkWifi } from 'react-icons/md';

import concatClassNames from '../../../utils/class-names';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

import styles from './InProgressIcon.module.scss';

type IInProgressIconProps = IIconProps

const InProgressIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IInProgressIconProps) => (
    <Icon
      className={concatClassNames(styles.icon, className)}
      size={size}
      helperText={helperText}
      Component={MdOutlineNetworkWifi}
    />
);

export default InProgressIcon;
