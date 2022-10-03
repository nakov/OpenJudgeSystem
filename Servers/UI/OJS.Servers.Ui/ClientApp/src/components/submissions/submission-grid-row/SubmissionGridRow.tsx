import React, { useCallback, useMemo } from 'react';
import { isNil } from 'lodash';

import { formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';

import IconSize from '../../guidelines/icons/common/icon-sizes';
import { IPublicSubmission } from '../../../hooks/submissions/use-public-submissions';

import { LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: IPublicSubmission;
}

const SubmissionGridRow = ({ submission }: ISubmissionGridRowProps) => {
    const {
        id: submissionId,
        createdOn,
        user: { username },
        result: { points, maxPoints },
        strategyName,
        problem: {
            name: problemName,
            contest: {
                id: contestId,
                name: contestName,
            },
        },
        isOfficial,
    } = submission;

    const renderStrategyIcon = useCallback(
        () => {
            const Icon = strategyTypeToIcon(fullStrategyNameToStrategyType(strategyName));

            if (isNil(Icon)) {
                return null;
            }

            return (<Icon size={IconSize.Large} helperText={strategyName}/>);
        },
        [ strategyName ],
    );

    const participationType = useMemo(
        () => isOfficial
            ? 'compete'
            : 'practice',
        [ isOfficial ],
    );

    return (
        <div className={styles.container}>
            <div className={styles.strategyContainer}>
                {renderStrategyIcon()}
            </div>
            <div className={styles.pointsContainer}>
                {points} / {maxPoints}
            </div>
            <div className={styles.detailsContainer}>
                <div>
                    {/* TODO: Fix this URL once https://github.com/SoftUni-Internal/exam-systems-issues/issues/184 is done */}
                    <LinkButton text={problemName}
                                to={`/contests/${contestId}/${participationType}`}
                                type={LinkButtonType.plain}
                                className={styles.link}/>
                    in
                    <LinkButton text={contestName}
                                to={`/contests/${contestId}/${participationType}`}
                                type={LinkButtonType.plain}
                                className={styles.link}/>
                </div>
                <div className={styles.dateAndUsernameContainer}>
                    <span className={styles.dateContainer}>{formatDate(createdOn)}</span>
                    <span>by {username}</span>
                </div>
            </div>

            <LinkButton
                to={`/submissions/${submissionId}/details`}
                text="Details"
            />
        </div>
    );
};


export default SubmissionGridRow;
