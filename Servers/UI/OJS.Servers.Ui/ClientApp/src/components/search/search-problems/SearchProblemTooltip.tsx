import React from 'react';

import { IProblemSearchType } from '../../../common/search-types';
import concatClassNames from '../../../utils/class-names';

import styles from './SearchProblemTooltip.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblemTooltip = ({ problem }: ISearchProblem) => {
    const { name } = problem;

    const searchProblemCardHeader = 'search-header';
    const searchProblemCardHeaderClassName = concatClassNames(styles.problemCardHeader, searchProblemCardHeader);
    const searchProblemText = 'search-problem-text';
    const searchProblemClassName = concatClassNames(styles.problemText, searchProblemText);

    return (
        <div className={searchProblemCardHeaderClassName}>
            <div className={styles.tooltip}>
                <span className={styles.tooltipText}>
                    {name}
                </span>
            </div>
            <span
              className={searchProblemClassName}
            >
                {name}
            </span>
        </div>
    );
};

export default SearchProblemTooltip;
