import React, { useCallback } from 'react';
import ReactNotification from 'react-notifications-component';
import { Link } from 'react-router-dom';
import logo from './softuni-logo-horizontal.svg';
import PageNav from '../nav/PageNav';
import Heading from '../../components/guidelines/headings/Heading';
import styles from './PageHeader.module.scss';
import { useAuth } from '../../hooks/use-auth';
import { administrationContestsGridUrl } from '../../utils/urls';

const PageHeader = () => {
    const { user } = useAuth();

    const renderLinks = useCallback(() => {
        const administrationLink = user.permissions.canAccessAdministration
            ? <a href={administrationContestsGridUrl} className={styles.headerLink}>Administration</a>
            : null;

        return (
            <>
                <Link to="/contests/all" className={styles.headerLink}>Contests</Link>
                <Link to="/submissions" className={styles.headerLink}>Submissions</Link>
                { administrationLink }
            </>
        );
    }, [ user ]);

    return (
        <header className={styles.header}>
            <ReactNotification />
            <div className={styles.headerSize}>
                <div className={styles.headerLinks}>
                    <Heading type="secondary" className={styles.heading}>
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
