import * as React from 'react';
import ReactNotification from 'react-notifications-component';
import logo from './softuni-logo-horizontal.svg';
import PageNav from '../nav/PageNav';
import Heading from '../../components/guidelines/headings/Heading';
import styles from './PageHeader.module.scss';

const PageHeader = () => (
    <header className={styles.header}>
        <ReactNotification />
        <div className={styles.headerSize}>
            <Heading type="secondary" className={styles.heading}>
                <a href="/">
                    <img src={logo} alt="softuni logo" />
                </a>
            </Heading>
            <PageNav />
        </div>
    </header>
);

export default PageHeader;
