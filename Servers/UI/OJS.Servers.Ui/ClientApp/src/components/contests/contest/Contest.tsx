import * as React from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import { IProblemType } from '../../../hooks/submissions/types';
import styles from './Contest.module.scss';

const Contest = () => {
    const { currentContest } = useContests();

    const renderTask = (problem: IProblemType) => (
        <li key={problem.id} className={styles.taskSideNavigationItem}>
            {problem.name}
        </li>
    );

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
        <div className={styles.contestWrapper}>
            <div className={styles.tasksSideNavigation}>
                <Heading type="secondary">Tasks</Heading>
                {renderTasksList()}
            </div>
            <div className={styles.contestMainWrapper}>
                <Heading type="primary">{currentContest?.name}</Heading>
            </div>
        </div>
    );
};

export default Contest;
