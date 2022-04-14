import * as React from 'react';
import { useCallback } from 'react';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';
import { Button } from '../../guidelines/buttons/Button';
import { useContests } from '../../../hooks/use-contests';
import styles from './ContestTasksNavigation.module.scss';
import concatClassNames from '../../../utils/class-names';
import Label from '../../guidelines/labels/Label';
import { IProblemType } from '../../../common/types';

const compareByOrderBy = (p1: IProblemType, p2: IProblemType) => p1.orderBy - p2.orderBy;

const ContestTasksNavigation = () => {
    const {
        currentContest,
        currentProblem,
        setProblem,
    } = useContests();

    const renderIcon = useCallback(
        ({ points, maximumPoints }: IProblemType) => {
            const type = points === 0
                ? 'warning'
                : points === 100
                    ? 'success'
                    : 'info';

            const currentPoints = points === 0
                ? '?'
                : points;

            const text = `${currentPoints}/${maximumPoints}`;

            return (
                <Label className={styles.taskLabel} type={type}>{text}</Label>
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
