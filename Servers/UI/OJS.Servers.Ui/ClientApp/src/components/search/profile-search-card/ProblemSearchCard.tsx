import React from 'react';
import { Link } from 'react-router-dom';

import { createUrlFriendlyString } from '../../../common/contest-helpers';
import { IProblemSearchType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import ContestButton from '../../contests/contest-button/ContestButton';

import styles from './ProblemSearchCard.module.scss';

interface IProblemSearchCardProps {
    problem: IProblemSearchType;
}
const ProblemSearchCard = (props: IProblemSearchCardProps) => {
    const { problem } = props;
    const { contest, id, name } = problem;
    const { getColorClassName, themeColors } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    return (
        <div className={`${styles.problemsSearchCardWrapper} ${textColorClassName} ${backgroundColorClassName}`}>
            <div>
                <Link
                  to={`/contests/${contest.id}/details/${createUrlFriendlyString(contest.name)}`}
                  className={`${styles.problemName} ${textColorClassName}`}
                >
                    {name}
                </Link>
                <div className={styles.contestName}>{contest.name}</div>
            </div>
            <div className={styles.buttonsWrapper}>
                <ContestButton isCompete isDisabled={!contest.canBeCompeted} id={contest.id} problemId={id} />
                <ContestButton isCompete={false} isDisabled={!contest.canBePracticed} id={contest.id} problemId={id} />
            </div>
        </div>
    );
};

export default ProblemSearchCard;
