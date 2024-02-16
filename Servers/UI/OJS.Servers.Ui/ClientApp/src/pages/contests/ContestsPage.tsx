/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { IGetAllContestsOptions, IIndexContestsType } from '../../common/types';
import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestCard from '../../components/contests/contest-card/ContestCard';
import ContestCategories from '../../components/contests/contest-categories/ContestCetegories';
import ContestStrategies from '../../components/contests/contest-strategies/ContestStrategies';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../hooks/use-theme';
import { useGetAllContestsQuery } from '../../redux/services/contestsService';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const { themeColors } = useTheme();
    const { category, strategy } = useSelector((state: any) => state.contests);
    const [ searchParams, setSearchParams ] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get('page')) {
            searchParams.set('page', '1');
            setSearchParams(searchParams);
        }
    }, []);

    const selectedPage = useMemo(() => {
        if (!searchParams.get('page')) {
            return 1;
        }
        return Number(searchParams.get('page'));
    }, [ searchParams ]);

    const contestParams = useMemo(() => {
        const params: IGetAllContestsOptions = {
            sortType: 'OrderBy',
            page: selectedPage,
        };
        if (category) {
            // eslint-disable-next-line prefer-destructuring
            params.category = category.id;
        }
        if (strategy) {
            // eslint-disable-next-line prefer-destructuring
            params.strategy = strategy.id;
        }

        return params;
    }, [ category, strategy, selectedPage ]);

    const {
        data: allContests,
        isLoading: areContestsLoading,
        error: allContestsError,
    } = useGetAllContestsQuery({ ...contestParams });

    const renderContest = useCallback((contest: IIndexContestsType) => (
        <ContestCard contest={contest} />
    ), []);

    const renderContests = useCallback(() => {
        if (!allContests?.items?.length) {
            return (
                <Heading type={HeadingType.secondary} style={{ color: themeColors.textColor, marginLeft: 50 }}>
                    No contests apply for this filter
                </Heading>
            );
        }

        return (
            <div className={styles.contestsListContainer}>
                <List
                  values={allContests?.items}
                  itemFunc={renderContest}
                  className={styles.contestsList}
                  orientation={Orientation.vertical}
                />
                <PaginationControls
                  count={allContests?.pagesCount}
                  page={selectedPage}
                  onChange={(page:number) => {
                      searchParams.set('page', page.toString());
                      setSearchParams(searchParams);
                  }}
                />
            </div>
        );
    }, [ allContests ]);

    if (allContestsError) { return <>Error loading contests</>; }

    return (
        <div style={{ padding: '20px 40px' }}>
            {areContestsLoading && <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>}
            <ContestBreadcrumbs />
            <div className={styles.contestsContainer}>
                <ContestCategories />
                <div style={{ width: '100%' }}>
                    <div className={styles.headingWrapper} style={{ color: themeColors.textColor }}>
                        <div>
                            { category
                                ? category.name
                                : 'All Categories'}
                        </div>
                        <ContestStrategies />
                    </div>
                    {renderContests()}
                </div>
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
