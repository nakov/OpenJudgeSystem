import { MdExpandMore } from 'react-icons/md';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IExpandMoreIconProps = IIconProps

const ExpandMoreIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IExpandMoreIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={MdExpandMore}
    />
);

export default ExpandMoreIcon;
