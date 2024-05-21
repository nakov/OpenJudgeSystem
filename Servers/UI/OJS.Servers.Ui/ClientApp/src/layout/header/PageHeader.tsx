/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useEffect } from 'react';
import { BsFillMoonFill } from 'react-icons/bs';
import { RiSunLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import MyProfileSvg from '../../assets/my-profile.svg';
import useTheme from '../../hooks/use-theme';
import { resetInInternalUser, setInternalUser, setIsGetUserInfoCompleted, setIsLoggedIn } from '../../redux/features/authorizationSlice';
import { setIsVisible } from '../../redux/features/searchSlice';
import { useGetUserinfoQuery } from '../../redux/services/authorizationService';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const { toggleSelectedTheme } = useTheme();

    const shouldRenderPageHeader = !pathname.includes('administration');

    const { mode } = useAppSelector((state) => state.theme);
    const { isVisible } = useAppSelector((state) => state.search);
    const { isLoggedIn, internalUser: user } = useAppSelector((state) => state.authorization);
    const { data: userData, isSuccess: isSuccessfulRequest } = useGetUserinfoQuery(null);

    useEffect(() => {
        if (isSuccessfulRequest && userData) {
            dispatch(setInternalUser(userData));
            dispatch(setIsLoggedIn(true));
        } else {
            dispatch(resetInInternalUser());
            dispatch(setIsLoggedIn(false));
        }

        dispatch(setIsGetUserInfoCompleted(true));
    }, [ isSuccessfulRequest, userData, dispatch ]);

    const renderThemeSwitcher = () => (
        <ToggleButtonGroup value={mode} className={styles.themeSwitchWrapper}>
            <ToggleButton
              value="light"
              onClick={toggleSelectedTheme}
            >
                <RiSunLine />
            </ToggleButton>
            <ToggleButton
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
                {user.canAccessAdministration &&
                <Link to="/administration-new" target="_blank" className={styles.navButton}>ADMINISTRATION</Link>}
            </div>
            <div className={styles.authButtons}>
                <i className={`fas fa-search ${styles.searchIcon}`} onClick={() => dispatch(setIsVisible(!isVisible))} />
                {isLoggedIn
                    ? (
                        <>
                            {' '}
                            <Link to="/profile" className={styles.navButton}>
                                <img height={40} width={40} src={MyProfileSvg} alt="my-profile" />
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
