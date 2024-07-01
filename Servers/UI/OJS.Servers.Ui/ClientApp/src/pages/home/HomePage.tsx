import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import { ContestCategories } from '../../components/contests/contest-categories/ContestCategories';
import { setContestDetails, updateContestCategoryBreadcrumbItem } from '../../redux/features/contestsSlice';
import { useAppDispatch } from '../../redux/store';
import { setLayout } from '../shared/set-layout';
import withTitle from '../shared/with-title';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import styles from './HomePage.module.scss';

const HomePage = () => {
    const location = useLocation();
    const { pathname } = location;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (pathname === '/' || pathname === '/contests/all' || pathname === '/contests/all?page=1') {
            dispatch(updateContestCategoryBreadcrumbItem({ elements: [] }));
            dispatch(setContestDetails({ contest: null }));
        }
    }, [ pathname, dispatch ]);

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
