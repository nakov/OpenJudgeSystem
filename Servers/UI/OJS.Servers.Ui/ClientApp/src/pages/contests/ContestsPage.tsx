import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { IFilter } from '../../common/contest-types';
import { IGetAllContestsOptions, IIndexContestsType } from '../../common/types';
import ContestBreadcrumb from '../../components/contests/contest-breadcrumb/ContestBreadcrumb';
import ContestCardNew from '../../components/contests/contest-card-new/ContestCard';
import ContestCategories from '../../components/contests/contest-categories/ContestCategories';
import ContestStrategies from '../../components/contests/contest-strategies/ContestStrategies';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../components/guidelines/alert/Alert';
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
    const navigate = useNavigate();
    const { themeColors } = useTheme();
    const { category, status, strategy, flattenCategories } = useSelector((state: any) => state.filterContests);
    const [ selectedPage, setSelectedPage ] = useState(1);
    const [ selectedCategory, setSelectedCategory ] = useState('');
    const [ filteredStrategyFilters, setFilteredStrategyFilters ] = useState<IFilter[]>([]);

    const contestParams = useMemo(() => {
        const params: IGetAllContestsOptions = {
            status: status.name,
            sortType: 'OrderBy',
            page: selectedPage,
        };
        if (category) {
            // eslint-disable-next-line prefer-destructuring
            params.category = category.value;
        }
        if (strategy) {
            // eslint-disable-next-line prefer-destructuring
            params.strategy = strategy.value;
        }
        if (status) {
            params.status = status;
        }

        return params;
    }, [ category, status, strategy, selectedPage ]);

    const {
        data: allContests,
        isLoading: areContestsLoading,
        error: allContestsError,
    } = useGetAllContestsQuery({ ...contestParams });

    const [ showAlert, setShowAlert ] = useState<boolean>(false);

    const onCategoryClick = (categoryName: any) => {
        setSelectedCategory(categoryName);
    };

    const renderContest = useCallback((contest: IIndexContestsType) => (
        <ContestCardNew contest={contest} />
    ), []);

    const renderContests = useCallback(() => {
        if (!allContests?.items) {
            return (
                <Heading type={HeadingType.secondary}>
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
                  onChange={(page:number) => setSelectedPage(page)}
                />
            </div>
        );
    }, [ allContests ]);

    if (allContestsError) { return <>Error loading contests</>; }

    return (
        <div style={{ padding: '20px 40px' }}>
            {areContestsLoading && <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>}
            {showAlert &&
                (
                    <Alert
                      message="The category you requested was not valid, all contests were loaded."
                      severity={AlertSeverity.Error}
                      variant={AlertVariant.Filled}
                      autoHideDuration={3000}
                      vertical={AlertVerticalOrientation.Bottom}
                      horizontal={AlertHorizontalOrientation.Right}
                    />
                )}
            <ContestBreadcrumb isLastBreadcrumbGrey />
            <div className={styles.contestsContainer}>
                <ContestCategories
                  onCategoryClick={onCategoryClick}
                  setStrategyFilters={setFilteredStrategyFilters}
                  shouldReset={false}
                />
                <div style={{ width: '100%' }}>
                    <div className={styles.headingWrapper} style={{ color: themeColors.textColor }}>
                        <div>{selectedCategory || 'All Categories'}</div>
                        <ContestStrategies filteredStrategies={filteredStrategyFilters} />
                    </div>
                    {renderContests()}
                </div>
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
