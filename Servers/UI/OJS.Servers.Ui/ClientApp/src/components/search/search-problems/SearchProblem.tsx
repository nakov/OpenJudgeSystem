import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ContestParticipationType } from '../../../common/constants';
import { IProblemSearchType } from '../../../common/search-types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import concatClassNames from '../../../utils/class-names';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import SearchProblemTooltip from './SearchProblemTooltip';

import styles from './SearchProblem.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblem = ({ problem }: ISearchProblem) => {
    const {
        contest,
        orderBy,
    } = problem;
    const searchProblemElement = 'search-problem-element';
    const searchContestElementClassName = concatClassNames(styles.problemElement, searchProblemElement);
    const searchProblemCategoryCardCategory = 'search-problem-category';
    const searchProblemCategoryClassName = concatClassNames(styles.problemCategory, searchProblemCategoryCardCategory);
    const searchProblemContestName = 'search-problem-contest';
    const searchProblemContestClassName = concatClassNames(styles.problemContest, searchProblemContestName);
    const contestCardControlBtns = 'search-problem-card-control-buttons';
    const searchProblemCardControlBtnsClassName = concatClassNames(styles.problemCardControls, contestCardControlBtns);

    const { getContestProblemUrl } = useAppUrls();

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
                        <LinkButton
                          id="button-card-compete"
                          to={getContestProblemUrl({
                              id: contest.id,
                              participationType: ContestParticipationType.Compete,
                              orderBy,
                          })}
                          text="Compete"
                          state={
                            contest.canBeCompeted
                                ? ButtonState.enabled
                                : ButtonState.disabled
                        }
                          size={ButtonSize.small}
                        />
                        <LinkButton
                          id="button-card-practice"
                          to={getContestProblemUrl({
                              id: contest.id,
                              participationType: ContestParticipationType.Practice,
                              orderBy,
                          })}
                          text="Practice"
                          type={LinkButtonType.secondary}
                          state={
                            contest.canBePracticed
                                ? ButtonState.enabled
                                : ButtonState.disabled
                        }
                          size={ButtonSize.small}
                        />
                    </div>
                </div>
            ),
        [ contest, searchContestElementClassName, problem, searchProblemCategoryClassName, searchProblemContestClassName,
            searchProblemCardControlBtnsClassName, getContestProblemUrl, orderBy ],
    );

    return (
        renderPage()
    );
};

export default SearchProblem;
