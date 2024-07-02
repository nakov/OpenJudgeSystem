import { Outlet, useLocation } from 'react-router-dom';

import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import { ContestCategories } from '../../components/contests/contest-categories/ContestCategories';
import { setLayout } from '../shared/set-layout';
import withTitle from '../shared/with-title';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import styles from './HomePage.module.scss';

const HomePage = () => {
    const location = useLocation();

    return (
        <div>
            <ContestBreadcrumbs isHidden={location.pathname === '/'} />
            <div className={styles.homePageWrapper}>
                <ContestCategories />
                <Outlet />
            </div>
        </div>
    );
};

export default setLayout(withTitle(HomePage, 'Home'));
