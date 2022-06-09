import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { ISubmissionDetails } from '../../../hooks/submissions/types';
import { Button } from '../../guidelines/buttons/Button';
import Text, { TextType } from '../../guidelines/text/Text';

import styles from './ProblemSubmission.module.scss';
import Label from '../../guidelines/labels/Label';
import ProblemSubmissionDetails from '../../contests/problem-submission-details/ProblemSubmissionDetails';
import concatClassNames from '../../../utils/class-names';
import DetailsIcon from '../../guidelines/icons/DetailsIcon';
import IconSize from '../../guidelines/icons/icon-sizes';

interface ISubmissionResultProps {
    submission: ISubmissionDetails;
}

const ProblemSubmission = ({ submission }: ISubmissionResultProps) => {
    const {
        submissionType,
        points,
        maximumPoints,
        isProcessed,
        createdOn,
    } = submission;

    const [ submissionDetailsContainerVisibilityClassName, setSubmissionDetailsContainerVisibilityClassName ] = useState(styles.hidden);
    const [ isDetailsOpen, setDetailsOpen ] = useState(false);
    const showDetails = useCallback(
        () => {
            setSubmissionDetailsContainerVisibilityClassName(submissionDetailsContainerVisibilityClassName === styles.visible
                ? styles.hidden
                : styles.visible);

            setDetailsOpen(!isDetailsOpen);
        },
        [ isDetailsOpen, submissionDetailsContainerVisibilityClassName ],
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

    const submissionDetailsContainerClassName = concatClassNames(
        styles.submissionDetailsContainer,
        submissionDetailsContainerVisibilityClassName,
    );

    const labelClass = 'label';
    const labelClassName = concatClassNames(
        styles.labelContainer,
        labelClass,
    );

    const showSubmissionDetailsButtonClassName = 'submissiondetailsButton';
    const currentSubmissionTypeClass = 'currentSubmissionType';
    const SubmissionTypeClassName = concatClassNames(
        styles.spacing,
        currentSubmissionTypeClass,
    );
    const submissionCreatedOnClassName = 'submissionCreatedOn';
    const submissionResultClassName = 'submissionResult';

    return (
        <div>
            <div className={styles.container}>
                <div className={labelClassName}>
                    {renderLabel()}
                </div>
                <div>
                    <Text type={TextType.Bold} className={submissionResultClassName}>
                        {result}
                    </Text>
                    <Text className={styles.spacing}>
                        with
                    </Text>
                    <Text type={TextType.Underlined} className={SubmissionTypeClassName}>
                        {renderSubmissionType()}
                    </Text>
                    <Text className={styles.spacing}>
                        ,
                        {' '}
                        run
                        {' '}
                    </Text>
                    <Text className={submissionCreatedOnClassName} type={TextType.Bold}>
                        {formatTime(createdOn)}
                    </Text>
                </div>
                <div>
                    <Button
                      className={showSubmissionDetailsButtonClassName}
                      type="plain"
                      onClick={() => showDetails()}
                    >
                        <DetailsIcon size={IconSize.Large} isOpen={isDetailsOpen} />
                    </Button>
                </div>
            </div>
            <div className={submissionDetailsContainerClassName}>
                <ProblemSubmissionDetails submission={submission} />
            </div>
        </div>
    );
};

export default ProblemSubmission;
