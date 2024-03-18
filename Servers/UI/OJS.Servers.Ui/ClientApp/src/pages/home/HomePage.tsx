import React, { useCallback } from 'react';
import { IconType } from 'react-icons';
import { FaCode, FaDeezer, FaPuzzlePiece, FaTasks, FaTrophy, FaUsers } from 'react-icons/fa';

import { ContestCetegories } from '../../components/contests/contest-categories/ContestCetegories';
import IconSize from '../../components/guidelines/icons/common/icon-sizes';
import Icon from '../../components/guidelines/icons/Icon';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../hooks/use-theme';
import { useGetHomeStatisticsQuery } from '../../redux/services/homeStatisticsService';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { setLayout } from '../shared/set-layout';

import styles from './HomePage.module.scss';

interface IHomePageStatistic {
    title: string;
    iconType: IconType;
    count: string;
}

const HomePageStatistic = (props: IHomePageStatistic) => {
    const { title, iconType, count } = props;

    const { themeColors, getColorClassName } = useTheme();
    const textColorClassName = getColorClassName(themeColors.textColor);

    return (
        <div className={styles.homePageStatisticWrapper}>
            <Icon
              size={IconSize.ExtraLarge}
              Component={iconType}
              color={themeColors.baseColor100}
            />
            <div className={styles.homePageStatisticTextWrapper}>
                <div style={{ color: '#44a9f8' }}>{title}</div>
                <div className={`${styles.homeStatisticCount} ${textColorClassName}`}>{count}</div>
            </div>
        </div>
    );
};

const HOME_STATISTICS = [
    { iconType: FaTrophy, title: 'Contests', dataKey: 'contestsCount' },
    { iconType: FaUsers, title: 'Users', dataKey: 'usersCount' },
    { iconType: FaTasks, title: 'Test strategies', dataKey: 'strategiesCount' },
    { iconType: FaPuzzlePiece, title: 'Problems', dataKey: 'problemsCount' },
    { iconType: FaDeezer, title: 'Submissions per day', dataKey: 'submissionsPerDayCount' },
    { iconType: FaCode, title: 'Submissions', dataKey: 'submissionsCount' },
];

const HomePage = () => {
    const { data, isLoading, error } = useGetHomeStatisticsQuery();
    const { themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);

    const renderHomeStatisticIcons = useCallback(() => {
        if (isLoading) {
            return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
        }
        if (error) {
            return <div className={textColorClassName}>Error fetching statistics data. Please try again!</div>;
        }
        return (
            <div className={styles.gridWrapper}>
                <div className={styles.homeStatistics}>
                    {HOME_STATISTICS.map((el, idx) => {
                        const { iconType, title, dataKey } = el;
                        // eslint-disable-next-line prefer-destructuring
                        const count = Number(data[dataKey]) > 1000
                            ? `${(Number(data[dataKey]) / 1000).toFixed(1)} K`
                            : data[dataKey];
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <HomePageStatistic key={`home-page-statistic-item-${idx}`} title={title} iconType={iconType} count={count} />
                        );
                    })}
                </div>
            </div>
        );
    }, [ data, error, isLoading, textColorClassName ]);

    return (
        <div className={styles.homePageWrapper}>
            <ContestCetegories isRenderedOnHomePage />
            <div className={styles.homePageContentWrapper}>
                <div className={styles.homePageHeader}>How to use SoftUni Judge Platform</div>
                <iframe style={{ border: `3px solid ${themeColors.textColor}` }} title="home-video" width={700} height={320} src="https://www.youtube.com/watch?v=zyhYnE4Fnmk&ab_channel=SoftwareUniversity%28SoftUni%29" />
                <hr />
                {renderHomeStatisticIcons()}
            </div>
        </div>
    );
};

export default setLayout(HomePage, true);
