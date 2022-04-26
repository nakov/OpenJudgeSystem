import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';
import { Button, LinkButton } from '../../guidelines/buttons/Button';
import styles from './ContestTasksNavigation.module.scss';
import concatClassNames from '../../../utils/class-names';
import Label from '../../guidelines/labels/Label';
import { IProblemType } from '../../../common/types';
import { useProblems } from '../../../hooks/use-problems';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { ContestParticipationType, ContestResultType } from '../../../common/constants';

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
                      onClick={() => selectProblemById(problem.id)}
                      className={className}
                      type="plain"
                    >
                        {problem.name}
                    </Button>
                    {renderIcon(problem)}
                </>
            );
        },
        [ currentProblem, renderIcon, selectProblemById ],
    );

    const renderTasksList = useCallback(
        () => (
            <List
              values={problems.sort(compareByOrderBy)}
              itemFunc={renderTask}
              className={styles.tasksListSideNavigation}
              itemClassName={styles.taskListItem}
              type="numbered"
            />
        ),
        [ problems, renderTask ],
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
            <Heading type="secondary">Tasks</Heading>
            {renderTasksList()}
            <LinkButton type='a' to={resultsLink} text="Results" />
        </div>
    );
};

export default ContestTasksNavigation;
