import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ContestParticipationType } from '../../../common/constants';
import { IProblemSearchType } from '../../../common/search-types';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonSize, ButtonState, ButtonType } from '../../guidelines/buttons/Button';

import SearchProblemTooltip from './SearchProblemTooltip';

import styles from './SearchProblem.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblem = ({ problem }: ISearchProblem) => {
    const {
        id,
        contest,
    } = problem;
    const searchProblemElement = 'search-problem-element';
    const searchContestElementClassName = concatClassNames(styles.problemElement, searchProblemElement);
    const searchProblemCategoryCardCategory = 'search-problem-category';
    const searchProblemCategoryClassName = concatClassNames(styles.problemCategory, searchProblemCategoryCardCategory);
    const searchProblemContestName = 'search-problem-contest';
    const searchProblemContestClassName = concatClassNames(styles.problemContest, searchProblemContestName);
    const contestCardControlBtns = 'search-problem-card-control-buttons';
    const searchProblemCardControlBtnsClassName = concatClassNames(styles.problemCardControls, contestCardControlBtns);

    const { actions: { initiateInternalProblem } } = useProblems();

    const renderPage = useCallback(
        () => isEmpty(contest)
            ? (
                <div className={searchContestElementClassName}>
                    <SearchProblemTooltip problem={problem} />
                </div>
            )
            : (
                <div className={searchContestElementClassName}>
                    <SearchProblemTooltip problem={problem} />
                    <span
                      className={searchProblemCategoryClassName}
                    >
                        {contest.category}
                    </span>
                    <span
                      className={searchProblemContestClassName}
                    >
                        Contest:
                        {' '}
                        {contest.name}
                    </span>
                    <div className={searchProblemCardControlBtnsClassName}>
                        <Button
                          id="button-card-compete"
                          type={ButtonType.secondary}
                          state={
                              contest.canBeCompeted
                                  ? ButtonState.enabled
                                  : ButtonState.disabled
                          }
                          onClick={() => initiateInternalProblem(id, contest.id, ContestParticipationType.Compete)}
                          text="Compete"
                          size={ButtonSize.small}
                        />
                        <Button
                          id="button-card-practice"
                          type={ButtonType.secondary}
                          state={
                                contest.canBePracticed
                                    ? ButtonState.enabled
                                    : ButtonState.disabled
                            }
                          onClick={() => initiateInternalProblem(id, contest.id, ContestParticipationType.Practice)}
                          text="Practice"
                          size={ButtonSize.small}
                        />
                    </div>
                </div>
            ),
        [ contest, searchContestElementClassName, problem, searchProblemCategoryClassName,
            searchProblemContestClassName, searchProblemCardControlBtnsClassName, initiateInternalProblem, id ],
    );

    return (
        renderPage()
    );
};

export default SearchProblem;
