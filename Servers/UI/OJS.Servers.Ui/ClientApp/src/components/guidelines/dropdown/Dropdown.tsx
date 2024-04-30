import { MenuItem, Select } from '@mui/material';

import useTheme from '../../../hooks/use-theme';
import isNilOrEmpty from '../../../utils/check-utils';

import styles from './Dropdown.module.scss';

interface IDropdownItem {
    id: string;
    name: string;
}

interface IDropdownProps {
    dropdownItems: Array<IDropdownItem>;
    value: string;
    placeholder?: string;
    handleDropdownItemClick?: (arg?: any) => any;
    isDisabled?: boolean;
}

const Dropdown = (props: IDropdownProps) => {
    const {
        dropdownItems,
        value,
        placeholder,
        handleDropdownItemClick,
        isDisabled = false,
    } = props;

    const { getColorClassName, themeColors } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);

    return (
        <Select
          className={`${styles.dropdown} ${textColorClassName}`}
          value={value}
          autoWidth
          displayEmpty
          disabled={isDisabled}
        >
            <MenuItem key="dropdown-default-item" value="" disabled>
                {
                    isNilOrEmpty(placeholder)
                        ? 'Select element'
                        : placeholder
                }
            </MenuItem>
            {dropdownItems.map((item: IDropdownItem) => (
                <MenuItem
                  key={`dropdown-item-${item.id}`}
                  value={item.id}
                  selected
                  onClick={() => handleDropdownItemClick?.(item)}
                  className={textColorClassName}
                >
                    {item.name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default Dropdown;
