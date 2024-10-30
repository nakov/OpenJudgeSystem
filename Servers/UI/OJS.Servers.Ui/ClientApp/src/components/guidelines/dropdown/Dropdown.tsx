import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Autocomplete, IconButton, InputAdornment, Popper, TextField } from '@mui/material';
import { IDropdownItem } from 'src/common/types';

import useTheme from '../../../hooks/use-theme';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './Dropdown.module.scss';

interface IDropdownProps {
    dropdownItems: Array<IDropdownItem>;
    value: IDropdownItem | null;
    handleDropdownItemClick?: (item: IDropdownItem | undefined) => void;
    placeholder?: string;
    isDisabled?: boolean;
    noOptionsFoundText?: string;
}

const StyledPopper = (popperProps: any) => (
    <Popper
      {...popperProps}
      placement="bottom-start"
      modifiers={[
          {
              name: 'flip',
              enabled: false,
          },
          {
              name: 'offset',
              options: { offset: [ 0, 8 ] },
          },
      ]}
    />
);

const Dropdown = (props: IDropdownProps) => {
    const {
        dropdownItems,
        value,
        handleDropdownItemClick,
        isDisabled = false,
        placeholder = 'Select element',
        noOptionsFoundText = 'No options found',
    } = props;

    const { isDarkMode } = useTheme();

    const theme = isDarkMode
        ? 'dark'
        : 'light';

    const [ inputValue, setInputValue ] = useState('');

    useEffect(() => {
        if (value) {
            setInputValue(value.name);
        } else {
            setInputValue('');
        }
    }, [ value ]);

    const autocompleteClasses = {
        root: styles[`${theme}Autocomplete`],
        inputRoot: `${styles.inputRoot} ${styles[`${theme}InputRoot`]}`,
        paper: styles[`${theme}Paper`],
        option: `${styles.option} ${styles[`${theme}Option`]}`,
        noOptions: `${styles.option} ${styles[`${theme}NoOptions`]}`,
        listbox: styles[`${theme}Listbox`],
        input: `${styles.input} ${styles[`${theme}Input`]}`,
    };

    const textFieldClasses = {
        root: `${styles.textField} ${styles[`${theme}TextField`]}`,
        input: `${styles.input} ${styles[`${theme}Input`]}`,
    };

    return (
        <Autocomplete
          options={dropdownItems}
          getOptionLabel={(option) => option.name}
          value={value ?? undefined}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue.trim() === ''
                  ? ''
                  : newInputValue);
          }}
          onChange={(event, newValue) => {
              handleDropdownItemClick?.(newValue);
          }}
          noOptionsText={noOptionsFoundText}
          disabled={isDisabled}
          PopperComponent={StyledPopper}
          classes={autocompleteClasses}
          disableClearable
          isOptionEqualToValue={(option, val) => option.id === val.id}
          renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                classes={textFieldClasses}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {inputValue !== '' && !isDisabled && (
                            <InputAdornment position="end">
                                <IconButton
                                  onClick={(event) => {
                                      event.stopPropagation();
                                      setInputValue('');
                                      handleDropdownItemClick?.(undefined);
                                  }}
                                  edge="end"
                                  size="small"
                                  aria-label="clear input"
                                >
                                    <IoMdClose />
                                </IconButton>
                            </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
              />
          )}
          ListboxProps={{ style: { maxHeight: '400px' } }}
        />
    );
};

export default Dropdown;
