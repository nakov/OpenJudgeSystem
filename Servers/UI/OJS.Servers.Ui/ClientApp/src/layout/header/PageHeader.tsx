import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import logo from './softuni-logo-horizontal.svg';
import PageNav from '../nav/PageNav';
import Heading from '../../components/guidelines/headings/Heading';
import styles from './PageHeader.module.scss';
import { useAuth } from '../../hooks/use-auth';
import { useUrls } from '../../hooks/use-urls';

const PageHeader = () => {
    const { user } = useAuth();

    const { administrationContestsGridUrl } = useUrls();

    const renderLinks = useCallback(() => {
        const administrationLink = user.permissions.canAccessAdministration
            ? <a href={administrationContestsGridUrl} className={styles.headerLink}>Administration</a>
            : null;

        return (
            <>
                <Link id="nav-contests-link" to="/contests" className={styles.headerLink}>Contests</Link>
                <Link id="nav-submissions-link" to="/submissions" className={styles.headerLink}>Submissions</Link>
                { administrationLink }
            </>
        );
    }, [ user ]);

    return (
        <header id="pageHeader" className={styles.header}>
            <ReactNotifications />
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
