import * as React from 'react';
import { useCallback } from 'react';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';
import { Button } from '../../guidelines/buttons/Button';
import { IProblemType } from '../../../hooks/contests/types';
import { useContests } from '../../../hooks/contests/use-contests';
import styles from './ContestTasksNavigation.module.scss';

const compareByOrderBy = (p1: IProblemType, p2: IProblemType) => p1.orderBy - p2.orderBy;

const ContestTasksNavigation = () => {
    const {
        currentContest,
        currentProblem,
        setProblem,
    } = useContests();

    const renderTask = useCallback(
        (problem: IProblemType) => {
            const { id: currentId } = currentProblem || {};
            const { id } = problem;

            const className = currentId === id
                ? styles.taskSideNavigationItemSelected
                : styles.taskSideNavigationItem;

            return (
                <Button
                  onClick={() => setProblem(problem)}
                  className={className}
                  type="plain"
                >
                    {problem.name}
                </Button>
            );
        },
        [ currentProblem, setProblem ],
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
