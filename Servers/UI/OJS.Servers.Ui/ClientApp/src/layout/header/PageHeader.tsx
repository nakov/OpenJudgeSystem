import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SearchIcon from '../../components/guidelines/icons/SearchIcon';
import { useAuth } from '../../hooks/use-auth';
import { useSearch } from '../../hooks/use-search';
import concatClassNames from '../../utils/class-names';
import generateId from '../../utils/id-generator';
import PageNav from '../nav/PageNav';

import logo from './softuni-logo-horizontal.svg';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { pathname } = useLocation();
    const { state: { user } } = useAuth();

    const { actions: { toggleVisibility } } = useSearch();

    const shouldRenderPageHeader = !pathname.includes('administration');
    const renderLinks = useCallback(() => {
        const administrationLink = user.permissions.canAccessAdministration
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
                          to="administration-new"
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
    }, [ user.permissions.canAccessAdministration ]);

    const btnId = useMemo(
        () => {
            const searchIdBtn = generateId();
            return `btn-submit-${searchIdBtn}`;
        },
        [],
    );

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
