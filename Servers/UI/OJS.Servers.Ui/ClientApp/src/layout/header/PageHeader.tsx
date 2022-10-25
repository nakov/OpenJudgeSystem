import React, { useCallback } from 'react';

import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useAuth } from '../../hooks/use-auth';
import { useUrls } from '../../hooks/use-urls';
import concatClassNames from '../../utils/class-names';
import PageNav from '../nav/PageNav';

import logo from './softuni-logo-horizontal.svg';

import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { state: { user } } = useAuth();

    const { getAdministrationNavigation } = useUrls();

    const renderLinks = useCallback(() => {
        const administrationLink = user.permissions.canAccessAdministration
            ? (
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to={getAdministrationNavigation()}
                  isToExternal
                  text="Administration"
                />
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
    }, [ getAdministrationNavigation, user.permissions.canAccessAdministration ]);

    const headingSecondaryClass = 'headingSeconary';
    const headingSecondaryClassName = concatClassNames(styles.heading, headingSecondaryClass);

    return (
        <header id="pageHeader" className={styles.header}>
            <div className={styles.headerSize}>
                <div className={styles.headerLinks}>
                    <Heading
                      id="page-header-h2"
                      type={HeadingType.secondary}
                      className={headingSecondaryClassName}
                    >
                        <a href="/">
                            <img src={logo} alt="softuni logo" />
                        </a>
                    </Heading>
                    { renderLinks() }
                </div>
                <PageNav />
            </div>
        </header>
    );
};

export default PageHeader;
