import React, { useCallback } from 'react';
import { IconType } from 'react-icons';
import { FaCode, FaDeezer, FaPuzzlePiece, FaTrophy, FaUsers } from 'react-icons/fa';

import { IFilter } from '../../common/contest-types';
import ContestCategories from '../../components/contests/contest-categories/ContestCategories';
import Icon from '../../components/guidelines/icons/Icon';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../hooks/use-theme';
import { useGetHomeStatisticsQuery } from '../../redux/services/homeStatisticsService';
import { setLayout } from '../shared/set-layout';

import styles from './HomePage.module.scss';

interface IHomePageStatistic {
    title: string;
    iconType: IconType;
    count: string;
}

const HomePageStatistic = (props: IHomePageStatistic) => {
    const { themeColors } = useTheme();
    const { title, iconType, count } = props;

    return (
        <div className={styles.homePageStatisticWrapper}>
            <Icon
              size={50}
              Component={iconType}
              color={themeColors.baseColor100}
            />
            <div className={styles.homePageStatisticTextWrapper}>
                <div style={{ color: '#44a9f8' }}>{title}</div>
                <div className={styles.homeStatisticCount} style={{ color: themeColors.textColor }}>{count}</div>
            </div>
        </div>
    );
};

const HOME_STATISTICS = [
    { iconType: FaTrophy, title: 'Contests', dataKey: 'contestsCount' },
    { iconType: FaUsers, title: 'Users', dataKey: 'usersCount' },
    { iconType: FaPuzzlePiece, title: 'Problems', dataKey: 'problemsCount' },
    { iconType: FaDeezer, title: 'Submissions per day', dataKey: 'submissionsPerDayCount' },
    { iconType: FaTrophy, title: 'Test strategies', dataKey: 'strategiesCount' },
    { iconType: FaCode, title: 'Submissions', dataKey: 'submissionsCount' },
];

const HomePage = () => {
    const { data, isLoading, error } = useGetHomeStatisticsQuery();
    const [ strategyFilters, setStrategyFilters ] = React.useState<IFilter[]>();

    const renderHomeStatisticIcons = useCallback(() => {
        if (isLoading) {
            return <SpinningLoader />;
        }
        if (error) {
            return <div>Error fetching statistics data. Please try again!</div>;
        }
        return (
            <div className={styles.gridWrapper}>
                <div className={styles.homeStatistics}>
                    {HOME_STATISTICS.map((el) => {
                        const { iconType, title, dataKey } = el;
                        // eslint-disable-next-line prefer-destructuring
                        const count = Number(data[dataKey]) > 1000
                            ? `${(Number(data[dataKey]) / 1000).toFixed(1)}K`
                            : data[dataKey];
                        return (
                            <HomePageStatistic title={title} iconType={iconType} count={count} />
                        );
                    })}
                </div>
            </div>
        );
    }, [ data, error, isLoading ]);

    return (
        <div className={styles.homePageWrapper}>
            <ContestCategories setStrategyFilters={setStrategyFilters} shouldReset={false} />
            <div className={styles.homePageContentWrapper}>
                <div className={styles.homePageHeader}>How to use SoftUni Judge Platform</div>
                <iframe title="home-video" width={700} height={320} src="https://www.youtube.com/watch?v=zyhYnE4Fnmk&ab_channel=SoftwareUniversity%28SoftUni%29" />
                <hr />
                {renderHomeStatisticIcons()}
            </div>
        </div>
    );
};

export default setLayout(HomePage, true);
