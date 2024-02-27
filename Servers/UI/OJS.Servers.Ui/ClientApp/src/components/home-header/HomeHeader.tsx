import React, { FC, useCallback, useEffect, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { Anything, IDictionary, IKeyValuePair } from '../../common/common-types';
import { useHomeStatistics } from '../../hooks/use-home-statistics';
import { toList } from '../../utils/object-utils';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import CodeIcon from '../guidelines/icons/CodeIcon';
import IconSize from '../guidelines/icons/common/icon-sizes';
import ContestIcon from '../guidelines/icons/ContestIcon';
import ProblemIcon from '../guidelines/icons/ProblemIcon';
import StrategyIcon from '../guidelines/icons/StrategyIcon';
import SubmissionsPerDayIcon from '../guidelines/icons/SubmissionsPerDayIcon';
import UsersIcon from '../guidelines/icons/UsersIcon';
import List, { Orientation } from '../guidelines/lists/List';
import StatisticBox from '../statistic-box/StatisticBox';

import styles from './HomeHeader.module.scss';

const keyToNameMap: IDictionary<string> = {
    usersCount: 'Users',
    submissionsCount: 'Submissions',
    submissionsPerDayCount: 'Submissions per day',
    problemsCount: 'Problems',
    strategiesCount: 'Test strategies',
    contestsCount: 'Contests',
};

const defaultProps = { className: styles.icon };

const keyToIconComponent: IDictionary<FC> = {
    usersCount: (props: Anything) => (<UsersIcon {...defaultProps} {...props} />),
    submissionsCount: (props: Anything) => (<CodeIcon {...defaultProps} {...props} />),
    submissionsPerDayCount: (props: Anything) => (<SubmissionsPerDayIcon {...defaultProps} {...props} />),
    problemsCount: (props: Anything) => (<ProblemIcon {...defaultProps} {...props} />),
    strategiesCount: (props: Anything) => (<StrategyIcon {...defaultProps} {...props} />),
    contestsCount: (props: Anything) => (<ContestIcon {...defaultProps} {...props} />),
};

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

        const { [type]: func } = keyToIconComponent;

        return func(props);
    };

    const renderStatistic = useCallback(
        (statisticItem: IKeyValuePair<number>) => {
            const { key, value } = statisticItem;

            return (
                <StatisticBox
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
        !isEmpty(statistics)
            ? (
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
            )
            : null
    );
};

export default HomeHeader;
