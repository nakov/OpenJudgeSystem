import React from 'react';

import FooterNavigation from './FooterNavigation';

import styles from './PageFooter.module.scss';

const PageFooter = () => (
    <footer id="pageFooter" className={styles.footer}>
        <FooterNavigation />
    </footer>
);

export default PageFooter;
