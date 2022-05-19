import React, { useCallback, useEffect, useState } from 'react';

import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { ListType } from '../../guidelines/lists/List';
import { Button, ButtonSize, ButtonType, LinkButton } from '../../guidelines/buttons/Button';
import Label, { LabelType } from '../../guidelines/labels/Label';

import concatClassNames from '../../../utils/class-names';
import { IProblemType } from '../../../common/types';
import { ContestParticipationType, ContestResultType } from '../../../common/constants';

import { useProblems } from '../../../hooks/use-problems';
import { useCurrentContest } from '../../../hooks/use-current-contest';

import styles from './ContestTasksNavigation.module.scss';

const compareByOrderBy = (p1: IProblemType, p2: IProblemType) => p1.orderBy - p2.orderBy;

const ContestTasksNavigation = () => {
    const [ resultsLink, setResultsLink ] = useState('');

    const {
        state: {
            currentProblem,
            problems,
        },
        actions: { selectProblemById },
    } = useProblems();

    const {
        state: {
            contest,
            isOfficial,
        },
    } = useCurrentContest();

    const renderIcon = useCallback(
        ({ points, maximumPoints }: IProblemType) => {
            const type = points === 0
                ? LabelType.warning
                : points === 100
                    ? LabelType.success
                    : LabelType.info;

            const currentPoints = points === 0
                ? '?'
                : points;

            const text = `${currentPoints}/${maximumPoints}`;

            return (
                <Label
                  className={styles.taskLabel}
                  type={type}
                >
                    {text}
                </Label>
            );
        },
        [],
    );

    const renderTask = useCallback(
        (problem: IProblemType) => {
            const { id: currentId } = currentProblem || {};
            const { id } = problem;

            const selectedClassName = currentId === id
                ? styles.selected
                : '';

            const className = concatClassNames(
                styles.taskSideNavigationItem,
                selectedClassName,
            );

            return (
                <>
                    <Button
                      onClick={() => selectProblemById(problem.id)}
                      className={className}
                      type={ButtonType.plain}
                    >
                        {problem.name}
                    </Button>
                    {renderIcon(problem)}
                </>
            );
        },
        [ currentProblem, renderIcon, selectProblemById ],
    );
    const sideBarTasksList = 'all-tasks-list';
    const sideBarTasksListClassName = concatClassNames(styles.tasksListSideNavigation, sideBarTasksList);
    const renderTasksList = useCallback(
        () => (
            <List
              values={problems.sort(compareByOrderBy)}
              itemFunc={renderTask}
              className={sideBarTasksListClassName}
              itemClassName={styles.taskListItem}
              type={ListType.numbered}
            />
        ),
        [ problems, renderTask, sideBarTasksListClassName ],
    );

    useEffect(() => {
        const participationType = isOfficial
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice;
        const newResultsLink = `/contests/${contest?.id}/${participationType}/results/${ContestResultType.Simple}`;
        setResultsLink(newResultsLink);
    }, [ isOfficial, contest ]);

    return (
        <div className={styles.tasksSideNavigation}>
            <Heading type={HeadingType.secondary}>Tasks</Heading>
            {renderTasksList()}
            <LinkButton size={ButtonSize.none} to={resultsLink} text="Results" />
        </div>
    );
};

export default ContestTasksNavigation;
