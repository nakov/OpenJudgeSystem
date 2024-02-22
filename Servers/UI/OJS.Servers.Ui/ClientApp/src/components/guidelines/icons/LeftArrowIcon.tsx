import { MdChevronLeft } from 'react-icons/md';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type ILeftArrowIconProps = IIconProps

const LeftArrowIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}:ILeftArrowIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={MdChevronLeft}
    />
);

export default LeftArrowIcon;
