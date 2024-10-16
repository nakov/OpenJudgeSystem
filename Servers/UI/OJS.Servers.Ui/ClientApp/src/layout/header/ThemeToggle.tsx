import React from 'react';
import { BsMoon } from 'react-icons/bs';
import { RiSunLine } from 'react-icons/ri';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import useTheme from 'src/hooks/use-theme';
import { useAppSelector } from 'src/redux/store';

import styles from 'src/layout/header/ThemeToggle.module.scss';

const ThemeToggle = () => {
    const { mode } = useAppSelector((state) => state.theme);
    const { toggleSelectedTheme } = useTheme();

    const buttonStyles = {
        '&.Mui-selected': {
            backgroundColor: '#687487',
            // hover effect when selected
            '&:hover': { backgroundColor: '#687487', color: '#FFF' },
        },
        // hover effect when unselected
        '&:hover': { backgroundColor: '#FFF', color: '#687487' },
    };

    return (
        <ToggleButtonGroup value={mode} className={styles.themeSwitchWrapper}>
            <ToggleButton
              value="light"
              onClick={toggleSelectedTheme}
              sx={buttonStyles}
            >
                <RiSunLine />
            </ToggleButton>
            <ToggleButton
              value="dark"
              onClick={toggleSelectedTheme}
              sx={buttonStyles}
            >
                <BsMoon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ThemeToggle;
