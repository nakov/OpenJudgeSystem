import React, { useCallback } from 'react';
import logo from './softuni-logo-horizontal.svg';
import PageNav from '../nav/PageNav';
import Heading from '../../components/guidelines/headings/Heading';
import styles from './PageHeader.module.scss';
import { useAuth } from '../../hooks/use-auth';
import { administrationContestsGridUrl } from '../../utils/urls';
import { LinkButton } from '../../components/guidelines/buttons/Button';

const PageHeader = () => {
    const { user } = useAuth();

    const renderLinks = useCallback(() => {
        const administrationLink = user.permissions.canAccessAdministration
            ? <LinkButton type='link' to={administrationContestsGridUrl} isToExternal={true} text="Administration" />
            : null;

        return (
            <>
                <LinkButton type='link' id="nav-contests-link" to="/contests" text="Contests" />
                <LinkButton type='link' id="nav-submissions-link" to="/submissions" text="Submissions" />
                { administrationLink }
            </>
        );
    }, [ user ]);

    return (
        <header id="pageHeader" className={styles.header}>
            <div className={styles.headerSize}>
                <div className={styles.headerLinks}>
                    <Heading id="page-header-h2" type="secondary" className={styles.heading}>
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
