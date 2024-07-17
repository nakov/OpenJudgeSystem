import { useEffect } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';

import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import { ContestCategories } from '../../components/contests/contest-categories/ContestCategories';
import {
    clearContestCategoryBreadcrumbItems,
    setContestDetails,
} from '../../redux/features/contestsSlice';
import { useAppDispatch } from '../../redux/store';
import { setLayout } from '../shared/set-layout';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import styles from './HomePage.module.scss';

const HomePage = () => {
    const location = useLocation();
    const [ searchParams ] = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!searchParams.get('category')) {
            /**
             * Clear contest details and breadcrumb items when no category is selected
             * so categories tree is collapsed properly (as it depends on category in the store)
             */
            dispatch(setContestDetails({ contest: null }));
            dispatch(clearContestCategoryBreadcrumbItems());
        }
    }, [ searchParams, dispatch ]);

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

export default setLayout(HomePage);
