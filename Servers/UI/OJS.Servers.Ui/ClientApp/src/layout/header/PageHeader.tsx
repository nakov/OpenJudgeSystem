/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useCallback } from 'react';
import { BsFillMoonFill } from 'react-icons/bs';
import { RiSunLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocation } from 'react-router-dom';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import { CONTESTS_PATH } from '../../common/urls';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import { useSearch } from '../../hooks/use-search';
import useTheme from '../../hooks/use-theme';
import { IAuthorizationReduxState, resetInInternalUser, setInternalUser, setIsLoggedIn } from '../../redux/features/authorizationSlice';
import { useGetUserinfoQuery } from '../../redux/services/authorizationService';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { pathname } = useLocation();

    const shouldRenderPageHeader = !pathname.includes('administration');

    const { actions: { toggleVisibility } } = useSearch();

    const { data: userData, isSuccess: isSuccessfullRequest } = useGetUserinfoQuery(null);

    const dispatch = useDispatch();

    const { toggleSelectedTheme } = useTheme();
    const { isLoggedIn } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const { internalUser: user } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);

    const renderLinks = useCallback(() => {
        const administrationLink = user.canAccessAdministration
            ? (
                <div className={styles.administrationsNavWrapper}>
                    <LinkButton
                      type={LinkButtonType.plain}
                      size={ButtonSize.none}
                      to="administration"
                      text="Administration"
                      isToExternal
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <LinkButton
                          type={LinkButtonType.plain}
                          size={ButtonSize.none}
                          to={`${CONTESTS_PATH}`}
                          text="Administration"
                          isToExternal
                        />
                    </div>
                    <FiberNewIcon className={styles.newIcon} />
                </div>
            )
            : null;
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const { mode } = useSelector((state: any) => state.theme);

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
                <Link to="/" className={`${styles.navButton} ${styles.logoBtn}`}>Softuni Judge</Link>
                <Link to="/contests" className={styles.navButton}>CONTESTS</Link>
                <Link to="/submissions" className={styles.navButton}>SUBMISSIONS</Link>
                {user.canAccessAdministration && <Link to="/administration" className={styles.navButton}>Administration</Link>}
            </div>
            <div className={styles.authButtons}>
                <i className={`fas fa-search ${styles.searchIcon}`} onClick={toggleVisibility} />
                {isLoggedIn
                    ? (
                        <>
                            {' '}
                            <Link to="/" className={styles.navButton}>MY PROFILE</Link>
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
