import React, { useCallback } from 'react';
import logo from './softuni-logo-horizontal.svg';
import PageNav from '../nav/PageNav';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useAuth } from '../../hooks/use-auth';
import { useUrls } from '../../hooks/use-urls';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import styles from './PageHeader.module.scss';

const PageHeader = () => {
    const { state: { user } } = useAuth();

    const { getAdministrationContestsGridUrl,getAdministrationNavigation } = useUrls();

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
    }, [ getAdministrationContestsGridUrl, user.permissions.canAccessAdministration ]);

    return (
        <header id="pageHeader" className={styles.header}>
            <div className={styles.headerSize}>
                <div className={styles.headerLinks}>
                    <Heading
                      id="page-header-h2"
                      type={HeadingType.secondary}
                      className={styles.heading}
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
