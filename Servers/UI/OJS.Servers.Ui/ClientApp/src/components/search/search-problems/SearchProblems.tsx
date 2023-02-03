import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';

import { ContestParticipationType } from '../../../common/constants';
import { IProblemSearchType } from '../../../common/search-types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import concatClassNames from '../../../utils/class-names';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SearchProblems.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblem = ({ problem }: ISearchProblem) => {
    const searchProblemText = 'search-problem-text';
    const searchProblemClassName = concatClassNames(styles.problemText, searchProblemText);
    const searchProblemElement = 'search-problem-element';
    const searchContestElementClassName = concatClassNames(styles.problemElement, searchProblemElement);
    const contestCardControlBtns = 'card-control-buttons';
    const contestCardControlBtnsClassName = concatClassNames(styles.contestCardControls, contestCardControlBtns);

    const { getRegisterContestTypeUrl } = useAppUrls();

    const renderPage = useCallback(
        () => isEmpty(problem.contest)
            ? (
                <div className={searchContestElementClassName}>
                    <span
                      className={searchProblemClassName}
                    >
                        {problem.name}
                    </span>
                </div>
            )
            : (
                <div className={searchContestElementClassName}>
                    <span
                      className={searchProblemClassName}
                    >
                        {problem.name}
                    </span>
                    <span
                      className={searchProblemClassName}
                    >
                        Contest:
                        {' '}
                        {problem.contest.name}
                        `
                    </span>
                    <div className={contestCardControlBtnsClassName}>
                        <LinkButton
                          id="button-card-compete"
                          to={getRegisterContestTypeUrl({
                              id: problem.contest.id,
                              participationType: ContestParticipationType.Compete,
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
                          to={getRegisterContestTypeUrl({
                              id: problem.contest.id,
                              participationType: ContestParticipationType.Practice,
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
        [ contestCardControlBtnsClassName, getRegisterContestTypeUrl, problem.contest,
            problem.name, searchContestElementClassName, searchProblemClassName ],
    );

    return (
        renderPage()
    );
};

export default SearchProblem;
