/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect } from 'react';
import { BsFillMoonFill } from 'react-icons/bs';
import { RiSunLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import MyProfileSvg from '../../assets/my-profile.svg';
import { useSearch } from '../../hooks/use-search';
import useTheme from '../../hooks/use-theme';
import { resetInInternalUser, setInternalUser, setIsLoggedIn } from '../../redux/features/authorizationSlice';
import { useGetUserinfoQuery } from '../../redux/services/authorizationService';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { toggleSelectedTheme } = useTheme();
    const { pathname } = useLocation();
    const shouldRenderPageHeader = !pathname.includes('administration');

    const { actions: { toggleVisibility } } = useSearch();
    const { mode } = useAppSelector((state) => state.theme);
    const { isLoggedIn, internalUser: user } = useAppSelector((state) => state.authorization);
    const { data: userData, isSuccess: isSuccessfullRequest } = useGetUserinfoQuery(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isSuccessfullRequest && userData) {
            dispatch(setInternalUser(userData));
            dispatch(setIsLoggedIn(true));
        } else {
            dispatch(resetInInternalUser());
            dispatch(setIsLoggedIn(false));
        }
    }, [ isSuccessfullRequest, userData, dispatch ]);

    const toggleButtonSxProps = {
        width: 50,
        backgroundColor: 'white',
        transition: 'background-color 0.1s ease-in-out',
        '&.Mui-selected': {
            backgroundColor: '#42abf8',
            color: 'white',
        },
        '&.Mui-selected:hover': { backgroundColor: { backgroundColor: '#00457a' } },
    };

    const renderThemeSwitcher = () => (
        <ToggleButtonGroup value={mode} className={styles.themeSwitchWrapper}>
            <ToggleButton
              sx={{ ...toggleButtonSxProps }}
              value="light"
              onClick={toggleSelectedTheme}
            >
                <RiSunLine />
            </ToggleButton>
            <ToggleButton
              sx={{ ...toggleButtonSxProps }}
              value="dark"
              onClick={toggleSelectedTheme}
            >
                <BsFillMoonFill />
            </ToggleButton>
        </ToggleButtonGroup>
    );

    if (!shouldRenderPageHeader) { return null; }
    return (
        <header className={styles.header}>
            <div>
                <Link to="/" className={`${styles.navButton} ${styles.logoBtn}`}>SoftUni Judge</Link>
                <Link to="/contests" className={styles.navButton}>CONTESTS</Link>
                <Link to="/submissions" className={styles.navButton}>SUBMISSIONS</Link>
                {user.canAccessAdministration && <Link to="/administration-new" className={styles.navButton}>ADMINISTRATION</Link>}
            </div>
            <div className={styles.authButtons}>
                <i className={`fas fa-search ${styles.searchIcon}`} onClick={toggleVisibility} />
                {isLoggedIn
                    ? (
                        <>
                            {' '}
                            <Link to="/profile" className={styles.navButton}>
                                <img height={40} width={40} src={MyProfileSvg} alt="my-profile" />
                            </Link>
                            <Link to="/logout" className={styles.navButton}>
                                LOGOUT
                            </Link>
                        </>
                    )
                    : (
                        <>
                            <Link to="/login" className={styles.navButton}>LOGIN</Link>
                            <Link to="/register" className={styles.navButton}>
                                REGISTER
                            </Link>
                        </>
                    )}
            </div>
            {renderThemeSwitcher()}
        </header>
    );
};

export default PageHeader;
