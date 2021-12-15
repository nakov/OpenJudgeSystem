import * as React from 'react';
import styles from './PageFooter.module.scss';

const PageFooter = () => (
    <footer className={styles.footer}>
        © 2011-2021 - Open Judge System (OJS) 1.5.20150729.95737d0 -
        <a href="https://github.com/NikolayIT/OpenJudgeSystem">Open source project.</a>
    </footer>
);

export default PageFooter;
