import { IProblemSearchType } from '../../../common/search-types';
import concatClassNames from '../../../utils/class-names';
import { getContestDetailsAppUrl } from '../../../utils/urls';
import { ButtonSize, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SearchProblemTooltip.module.scss';

interface ISearchProblem {
    problem: IProblemSearchType;
}

const SearchProblemTooltip = ({ problem }: ISearchProblem) => {
    const { name, contest } = problem;
    const { id: contestId } = contest;

    const searchProblemCardHeader = 'search-header';
    const searchProblemCardHeaderClassName = concatClassNames(
        styles.problemCardHeader,
        searchProblemCardHeader,
        name.length >= 23
            ? styles.problemTitleHoverable
            : '',
    );
    const searchProblemText = 'search-problem-text';
    const searchProblemClassName = concatClassNames(styles.problemText, searchProblemText);

    return (
        <div className={searchProblemCardHeaderClassName}>
            <div className={styles.tooltip}>
                <span className={styles.tooltipText}>
                    <LinkButton
                      type={LinkButtonType.plain}
                      size={ButtonSize.none}
                      to={getContestDetailsAppUrl(contestId)}
                      text={name}
                    />
                </span>
            </div>
            <span className={searchProblemClassName}>
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to={getContestDetailsAppUrl(contestId)}
                  text={name}
                />
            </span>
        </div>
    );
};

export default SearchProblemTooltip;
