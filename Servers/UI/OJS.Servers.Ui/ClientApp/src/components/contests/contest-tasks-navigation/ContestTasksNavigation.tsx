import * as React from 'react';
import { useCallback } from 'react';
import List from '../../guidelines/lists/List';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import styles from './ContestTasksNavigation.module.scss';
import concatClassNames from '../../../utils/class-names';
import Label, { LabelType } from '../../guidelines/labels/Label';
import { IProblemType } from '../../../common/types';
import { useProblems } from '../../../hooks/use-problems';

const compareByOrderBy = (p1: IProblemType, p2: IProblemType) => p1.orderBy - p2.orderBy;

const ContestTasksNavigation = () => {
    const {
        state: {
            currentProblem,
            problems,
        },
        actions: { selectProblemById },
    } = useProblems();

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
              type="numbered"
            />
        ),
        [ problems, renderTask, sideBarTasksListClassName ],
    );

    return (
        <div className={styles.tasksSideNavigation}>
            <Heading type={HeadingType.secondary}>Tasks</Heading>
            {renderTasksList()}
        </div>
    );
};

export default ContestTasksNavigation;
