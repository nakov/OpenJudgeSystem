import React, { useCallback, useEffect, useState } from 'react';

import { ContestParticipationType, ContestResultType } from '../../../common/constants';
import { IProblemType } from '../../../common/types';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { ListType } from '../../guidelines/lists/List';
import SubmissionResultPointsLabel from '../../submissions/submission-result-points-label/SubmissionResultPointsLabel';

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
                    <SubmissionResultPointsLabel
                      points={problem.points}
                      maximumPoints={problem.maximumPoints}
                      isProcessed={false}
                    />
                </>
            );
        },
        [ currentProblem, selectProblemById ],
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

    const resultsButtonClass = 'resultsButton';
    const refreshButtonClassName = concatClassNames(styles.resultsButton, resultsButtonClass);

    return (
        <div className={styles.tasksSideNavigation}>
            <Heading type={HeadingType.secondary}>Tasks</Heading>
            {renderTasksList()}
            <LinkButton
              type={LinkButtonType.secondary}
              to={resultsLink}
              text="Results"
              className={refreshButtonClassName}
            />
        </div>
    );
};

export default ContestTasksNavigation;
