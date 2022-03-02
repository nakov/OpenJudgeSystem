import * as React from 'react';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';
import { useContests } from '../../../hooks/contests/use-contests';
import styles from './ContestTasksNavigation.module.scss';
import { IProblemType } from '../../../hooks/contests/types';

const ContestTasksNavigation = () => {
    const { currentContest, currentProblem, setProblem } = useContests();

    const renderTask = (problem: IProblemType) => {
        // eslint-disable-next-line eqeqeq
        const className = currentProblem?.id == problem.id
            ? styles.taskSideNavigationItemSelected
            : styles.taskSideNavigationItem;

        return (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
            <p
              key={problem.id}
              className={className}
              onClick={() => setProblem(problem)}
            >
                {problem.name}
            </p>
        );
    };

    const renderTasksList = () => (
        currentContest == null
            ? null
            : (
                <List
                  values={currentContest.problems.sort((a, b) => a.orderBy - b.orderBy)}
                  itemFunc={renderTask}
                  className={styles.tasksListSideNavigation}
                />
            )
    );

    return (
        <div className={styles.tasksSideNavigation}>
            <Heading type="secondary">Tasks</Heading>
            {renderTasksList()}
        </div>
    );
};

export default ContestTasksNavigation;
