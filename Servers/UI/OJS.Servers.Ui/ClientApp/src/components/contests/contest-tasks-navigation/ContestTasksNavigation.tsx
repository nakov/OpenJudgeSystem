import * as React from 'react';
import { useCallback } from 'react';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';
import { Button } from '../../guidelines/buttons/Button';
import { IProblemType } from '../../../hooks/contests/types';
import { useContests } from '../../../hooks/contests/use-contests';
import styles from './ContestTasksNavigation.module.scss';
import concatClassNames from '../../../utils/class-names';
import TickIcon from '../../guidelines/icons/TickIcon';
import IconSize from '../../guidelines/icons/icon-sizes';
import InProgressIcon from '../../guidelines/icons/InProgressIcon';

const compareByOrderBy = (p1: IProblemType, p2: IProblemType) => p1.orderBy - p2.orderBy;

const ContestTasksNavigation = () => {
    const {
        currentContest,
        currentProblem,
        setProblem,
    } = useContests();

    const renderIcon = useCallback(
        ({ points, maximumPoints }: IProblemType) => {
            if (points === 0) {
                return null;
            }

            if (points === maximumPoints) {
                return (
                    <TickIcon helperText="You solved this problem" size={IconSize.Medium} />
                );
            }

            const helperText = `You have ${points} out of ${maximumPoints} points.`;

            return (
                <InProgressIcon
                  helperText={helperText}
                  size={IconSize.Medium}
                />
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
                      onClick={() => setProblem(problem)}
                      className={className}
                      type="plain"
                    >
                        {problem.name}
                    </Button>
                    {renderIcon(problem)}
                </>
            );
        },
        [ currentProblem, renderIcon, setProblem ],
    );

    const renderTasksList = useCallback(
        () => {
            if (currentContest === null) {
                return null;
            }

            const { problems } = currentContest;
            return (
                <List
                  values={problems.sort(compareByOrderBy)}
                  itemFunc={renderTask}
                  className={styles.tasksListSideNavigation}
                  itemClassName={styles.taskListItem}
                  type="numbered"
                />
            );
        },
        [ currentContest, renderTask ],
    );

    return (
        <div className={styles.tasksSideNavigation}>
            <Heading type="secondary">Tasks</Heading>
            {renderTasksList()}
        </div>
    );
};

export default ContestTasksNavigation;
