import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { isNil } from 'lodash';
import { useHomeStatistics } from '../../hooks/use-home-statistics';
import List, { Orientation } from '../guidelines/lists/List';
import { IDictionary, IKeyValuePair } from '../../common/common-types';
import StatisticBox, { StatisticBoxSize } from '../statistic-box/StatisticBox';
import styles from './HomeHeader.module.scss';
import IconSize from '../guidelines/icons/common/icon-sizes';
import UsersIcon from '../guidelines/icons/UsersIcon';
import CodeIcon from '../guidelines/icons/CodeIcon';
import ProblemIcon from '../guidelines/icons/ProblemIcon';
import StrategyIcon from '../guidelines/icons/StrategyIcon';
import ContestIcon from '../guidelines/icons/ContestIcon';
import SubmissionsPerDayIcon from '../guidelines/icons/SubmissionsPerDayIcon';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import { toList } from '../../utils/object-utils';

const keyToNameMap: IDictionary<string> = {
    usersCount: 'Users',
    submissionsCount: 'Submissions',
    submissionsPerDayCount: 'Submissions per day',
    problemsCount: 'Problems',
    strategiesCount: 'Test strategies',
    contestsCount: 'Contests',
};

const defeaultProps = { className: styles.icon };

/* eslint-disable react/jsx-props-no-spreading */
const keyToIconComponent: IDictionary<FC> = {
    usersCount: (props: any) => (<UsersIcon {...defeaultProps} {...props} />),
    submissionsCount: (props: any) => (<CodeIcon {...defeaultProps} {...props} />),
    submissionsPerDayCount: (props: any) => (<SubmissionsPerDayIcon {...defeaultProps} {...props} />),
    problemsCount: (props: any) => (<ProblemIcon {...defeaultProps} {...props} />),
    strategiesCount: (props: any) => (<StrategyIcon {...defeaultProps} {...props} />),
    contestsCount: (props: any) => (<ContestIcon {...defeaultProps} {...props} />),
};
/* eslint-enable react/jsx-props-no-spreading */

const HomeHeader = () => {
    const {
        state: { statistics },
        actions: { load },
    } = useHomeStatistics();

    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [ load ],
    );

    const renderIcon = (type: string) => {
        const props = { size: IconSize.ExtraLarge, children: {} };
        const func = keyToIconComponent[type];

        return func(props);
    };

    const renderStatistic = useCallback(
        (statisticItem: IKeyValuePair<number>) => {
            const { key, value } = statisticItem;

            return (
                <StatisticBox
                  size={StatisticBoxSize.big}
                  statistic={{ name: keyToNameMap[key], value }}
                  renderIcon={() => renderIcon(key)}
                />
            );
        },
        [],
    );

    const statisticsList = useMemo(
        () => {
            if (isNil(statistics)) {
                return [];
            }

            return toList(statistics);
        },
        [ statistics ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                SoftUni Judge Numbers
            </Heading>
            <List
              values={statisticsList}
              itemFunc={renderStatistic}
              className={styles.statisticsList}
              itemClassName={styles.statisticsListItem}
              wrap
              orientation={Orientation.horizontal}
            />
        </>
    );
};

export default HomeHeader;
