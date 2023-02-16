import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ContestParticipationType } from '../../../common/constants';
import { IProblemSearchType } from '../../../common/search-types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SearchProblems.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblem = ({ problem }: ISearchProblem) => {
    const searchProblemCardHeader = 'search-header';
    const searchProblemCardHeaderClassName = concatClassNames(styles.problemCardHeader, searchProblemCardHeader);
    const searchProblemText = 'search-problem-text';
    const searchProblemClassName = concatClassNames(styles.problemText, searchProblemText);
    const searchProblemElement = 'search-problem-element';
    const searchContestElementClassName = concatClassNames(styles.problemElement, searchProblemElement);
    const searchProblemCategoryCardCategory = 'search-problem-category';
    const searchProblemCategoryClassName = concatClassNames(styles.problemCategory, searchProblemCategoryCardCategory);
    const searchProblemContestName = 'search-problem-contest';
    const searchProblemContestClassName = concatClassNames(styles.problemContest, searchProblemContestName);
    const contestCardControlBtns = 'search-problem-card-control-buttons';
    const searchProblemCardControlBtnsClassName = concatClassNames(styles.problemCardControls, contestCardControlBtns);

    const { getContestProblemUrl } = useAppUrls();

    const { state: { problems } } = useProblems();
    console.log(problems);

    const renderPage = useCallback(
        () => isEmpty(problem.contest)
            ? (
                <div className={searchContestElementClassName}>
                    <div className={searchProblemCardHeaderClassName}>
                        <div className={styles.tooltip}>
                            <span className={styles.tooltipText}>{problem.name}</span>
                        </div>
                        <span
                          className={searchProblemClassName}
                        >
                            {problem.name}
                        </span>
                    </div>
                </div>
            )
            : (
                <div className={searchContestElementClassName}>
                    <div className={searchProblemCardHeaderClassName}>
                        <div className={styles.tooltip}>
                            <span className={styles.tooltipText}>{problem.name}</span>
                        </div>
                        <span
                          className={searchProblemClassName}
                        >
                            {problem.name}
                        </span>
                    </div>
                    <span
                      className={searchProblemCategoryClassName}
                    >
                        {problem.contest.category}
                    </span>
                    <span
                      className={searchProblemContestClassName}
                    >
                        Contest:
                        {' '}
                        {problem.contest.name}
                        `
                    </span>
                    <div className={searchProblemCardControlBtnsClassName}>
                        <LinkButton
                          id="button-card-compete"
                          to={getContestProblemUrl({
                              id: problem.contest.id,
                              participationType: ContestParticipationType.Compete,
                              orderBy: problem.orderBy,
                          })}
                          text="Compete"
                          state={
                            problem.contest.canBeCompeted
                                ? ButtonState.enabled
                                : ButtonState.disabled
                        }
                          size={ButtonSize.small}
                        />
                        <LinkButton
                          id="button-card-practice"
                          to={getContestProblemUrl({
                              id: problem.contest.id,
                              participationType: ContestParticipationType.Practice,
                              orderBy: problem.orderBy,
                          })}
                          text="Practice"
                          type={LinkButtonType.secondary}
                          state={
                            problem.contest.canBePracticed
                                ? ButtonState.enabled
                                : ButtonState.disabled
                        }
                          size={ButtonSize.small}
                        />
                    </div>
                </div>
            ),
        [ getContestProblemUrl, problem.contest, problem.name, problem.orderBy, searchContestElementClassName,
            searchProblemCardControlBtnsClassName, searchProblemCardHeaderClassName, searchProblemCategoryClassName,
            searchProblemClassName, searchProblemContestClassName ],
    );

    return (
        renderPage()
    );
};

export default SearchProblem;
