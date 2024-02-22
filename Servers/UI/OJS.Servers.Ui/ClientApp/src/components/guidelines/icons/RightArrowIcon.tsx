import { MdChevronRight } from 'react-icons/md';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IRightArrowIconProps = IIconProps

const RightArrowIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}:IRightArrowIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={MdChevronRight}
    />
);

export default RightArrowIcon;
