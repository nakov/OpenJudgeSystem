import * as React from 'react';
import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { ISubmissionResultType } from '../../../hooks/submissions/types';
import { Button } from '../../guidelines/buttons/Button';
import Text, { TextType } from '../../guidelines/text/Text';

import styles from './ProblemSubmission.module.scss';
import Label from '../../guidelines/labels/Label';

interface ISubmissionResultProps {
    submission: ISubmissionResultType;
}

const ProblemSubmission = ({ submission }: ISubmissionResultProps) => {
    const {
        submissionType,
        points,
        maximumPoints,
        isProcessed,
        createdOn,
    } = submission;
    const showDetails = useCallback(
        () => {
            alert(`${points}/${maximumPoints}`);
        },
        [ maximumPoints, points ],
    );
    const isMaxPoints = points === maximumPoints;

    const formatTime = useCallback(
        (date: Date) => {
            const result = moment().diff(date, 'days') > 3
                ? moment(date).format('DD MMM yyyy')
                : moment(date).fromNow();
            return <>{result}</>;
        },
        [],
    );
    const renderLabel = useCallback(
        () => {
            const type = isProcessed
                ? isMaxPoints
                    ? 'success'
                    : points > 0
                        ? 'warning'
                        : 'danger'
                : 'info';

            const text = isProcessed
                ? isMaxPoints
                    ? 'Success'
                    : points > 0
                        ? 'Partial'
                        : 'Error'
                : 'Processing';

            return (
                <Label type={type}>
                    {text}
                </Label>
            );
        },
        [ isMaxPoints, isProcessed, points ],
    );

    const renderSubmissionType = useCallback(
        () => (<>{submissionType}</>),
        [ submissionType ],
    );

    const result = useMemo(
        () => (isProcessed
            ? `${points}/${maximumPoints}`
            : `?/${maximumPoints}`),
        [ isProcessed, maximumPoints, points ],
    );

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer}>
                {renderLabel()}
            </div>
            <div>
                <div>
                    <Text type={TextType.Bold}>
                        {result}
                    </Text>
                    <Text className={styles.spacing}>
                        with
                    </Text>
                    <Text type={TextType.Underlined} className={styles.spacing}>
                        {renderSubmissionType()}
                    </Text>
                    <Text className={styles.spacing}>
                        ,
                        {' '}
                        run
                        {' '}
                    </Text>
                    <Text type={TextType.Bold}>
                        {formatTime(createdOn)}
                    </Text>
                </div>
            </div>
            <div>
                <Button type="plain" onClick={() => showDetails()}>Details</Button>
            </div>
        </div>
    );
};

export default ProblemSubmission;
