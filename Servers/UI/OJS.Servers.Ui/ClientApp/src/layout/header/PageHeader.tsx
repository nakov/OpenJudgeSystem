import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SearchIcon from '../../components/guidelines/icons/SearchIcon';
import { useSearch } from '../../hooks/use-search';
import { IAuthorizationReduxState, resetInInternalUser, setInternalUser, setIsLoggedIn } from '../../redux/features/authorizationSlice';
import { useGetUserinfoQuery } from '../../redux/services/authorizationService';
import concatClassNames from '../../utils/class-names';
import generateId from '../../utils/id-generator';
import PageNav from '../nav/PageNav';

import logo from './softuni-logo-horizontal.svg';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { pathname } = useLocation();

    const shouldRenderPageHeader = !pathname.includes('administration');

    const { actions: { toggleVisibility } } = useSearch();

    const { data: userData, isSuccess: isSuccessfullRequest } = useGetUserinfoQuery(null);

    const dispatch = useDispatch();

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
                          to="administration-new/contests"
                          text="Administration"
                          isToExternal
                        />
                    </div>
                    <FiberNewIcon className={styles.newIcon} />
                </div>
            )
            : null;

        return (
            <>
                <LinkButton
                  id="nav-contests-link"
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to="/contests"
                  text="Contests"
                />
                <LinkButton
                  id="nav-submissions-link"
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to="/submissions"
                  text="Submissions"
                />
                { administrationLink }
            </>
        );
    }, [ user.canAccessAdministration ]);

    const btnId = useMemo(
        () => {
            const searchIdBtn = generateId();
            return `btn-submit-${searchIdBtn}`;
        },
        [],
    );
    useEffect(() => {
        if (isSuccessfullRequest && userData) {
            dispatch(setInternalUser(userData));
            dispatch(setIsLoggedIn(true));
        } else {
            dispatch(resetInInternalUser());
            dispatch(setIsLoggedIn(false));
        }
    }, [ isSuccessfullRequest, userData, dispatch ]);

    const handleSearchClick = useCallback(
        () => toggleVisibility(),
        [ toggleVisibility ],
    );

    const searchBtnClassName = concatClassNames('searchButton', styles.searchButton);

    const searchButton = useCallback(
        () => (
            <Button
              id={btnId}
              onClick={handleSearchClick}
              type={ButtonType.submit}
              internalClassName={searchBtnClassName}
            >
                <SearchIcon />
            </Button>
        ),
        [ btnId, handleSearchClick, searchBtnClassName ],
    );

    const headingSecondaryClass = 'headingSeconary';
    const headingSecondaryClassName = concatClassNames(styles.heading, headingSecondaryClass);

    if (!shouldRenderPageHeader) { return null; }
    return (
        <header id="pageHeader" className={styles.header}>
            <div className={styles.headerSize}>
                <div className={styles.headerLinks}>
                    <Heading
                      id="page-header-h2"
                      type={HeadingType.secondary}
                      className={headingSecondaryClassName}
                    >
                        <LinkButton
                          to="/"
                          type={LinkButtonType.image}
                          altText="Softuni logo"
                          imgSrc={logo}
                        />
                    </Heading>
                    { renderLinks() }
                </div>
                <div className={styles.navbarContainer}>
                    { searchButton() }
                    <PageNav />
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
