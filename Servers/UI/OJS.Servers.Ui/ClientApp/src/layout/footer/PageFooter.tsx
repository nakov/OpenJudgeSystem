import { useLocation } from 'react-router-dom';

import FooterNavigation from './FooterNavigation';

import styles from './PageFooter.module.scss';

const PageFooter = () => {
    const { pathname } = useLocation();

    const shouldRenderFooter = !pathname.includes('administration');

    if (!shouldRenderFooter) { return null; }
    return (
        <footer id="pageFooter" className={styles.footer}>
            <FooterNavigation />
        </footer>
    );
};

export default PageFooter;
