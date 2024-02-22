import { BsSearch } from 'react-icons/bs';

import concatClassNames from '../../../utils/class-names';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

import styles from './SearchIcon.module.scss';

type IExpandMoreIconProps = IIconProps

const SearchIcon = ({
    className = '',
    size = IconSize.Large,
    helperText = '',
}: IExpandMoreIconProps) => (
    <Icon
      className={concatClassNames(styles.searchIcon, className)}
      size={size}
      helperText={helperText}
      Component={BsSearch}
    />
);

export default SearchIcon;
