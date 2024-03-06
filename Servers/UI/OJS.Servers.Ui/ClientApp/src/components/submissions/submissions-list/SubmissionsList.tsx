import React, { useCallback, useMemo } from 'react';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionDetailsType, ISubmissionResults } from '../../../hooks/submissions/types';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import concatClassNames from '../../../utils/class-names';
import { formatDate } from '../../../utils/dates';
import { getProblemSubmissionDetailsUrl } from '../../../utils/urls';
import { IHaveOptionalClassName } from '../../common/Props';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Label, { LabelType } from '../../guidelines/labels/Label';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import Text from '../../guidelines/text/Text';
import ExecutionResult from '../execution-result/ExecutionResult';
import SubmissionResultPointsLabel from '../submission-result-points-label/SubmissionResultPointsLabel';

import styles from './SubmissionsList.module.scss';

interface ISubmissionsListProps extends IHaveOptionalClassName {
    items: ISubmissionResults[];
    selectedSubmission: ISubmissionDetailsType | null;
}

const SubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
}: ISubmissionsListProps) => {
    const { state: { isOfficial } } = useCurrentContest();

    const containerClassName = useMemo(
        () => concatClassNames(styles.submissionsScroll, className),
        [ className ],
    );

    const submissionsListClass = 'submissionsSideNavigationList';
    const submissionsListClassName = useMemo(
        () => concatClassNames(styles.submissionsList, submissionsListClass),
        [],
    );
    const submissionListItemClass = useMemo(
        () => 'submissionListItem',
        [],
    );
    const submissionListItemClassName = useMemo(
        () => concatClassNames(styles.submissionListItem, submissionListItemClass),
        [ submissionListItemClass ],
    );
    const submissionBtnClass = 'submissionBtn';
    const submissionsTypeLabelClassName = concatClassNames(styles.submissionTypeLabel);

    const renderSubmissionListItem = useCallback(
        (submission: ISubmissionResults) => {
            const { id: selectedSubmissionId } = selectedSubmission || {};
            const {
                id,
                points,
                maximumPoints,
                isProcessed,
                createdOn,
                submissionType,
                testRunsCount,
            } = submission;
            const isSelectedSubmission = id === selectedSubmissionId;
            const selectedClassName = isSelectedSubmission
                ? styles.selected
                : '';

            const itemClassName = concatClassNames(
                styles.submissionContainer,
                selectedClassName,
            );

            const buttonState = isSelectedSubmission
                ? ButtonState.disabled
                : ButtonState.enabled;

            const typeLabelText = contestParticipationType(isOfficial);

            return (
                <div className={itemClassName}>
                    <div className={styles.infoContainer}>
                        <SubmissionResultPointsLabel
                          points={points}
                          maximumPoints={maximumPoints}
                          isProcessed={isProcessed}
                          testRunsCount={testRunsCount}
                        />
                        <p className={styles.submissionCreatedOnParagraph}>{formatDate(createdOn)}</p>
                    </div>
                    <div className={styles.actionsContainer}>
                        <div className={styles.textContainer}>
                            <Text className={styles.submissionTypeText}>
                                {submissionType}
                            </Text>
                            {!isProcessed
                                ? (
                                    <Text className={styles.isProcessingTypeText}>Not processed yet</Text>
                                )
                                : null}
                        </div>
                        <div className={styles.submissionDetailsButtonsWrapper}>
                            <Label type={LabelType.plain} text={typeLabelText} className={submissionsTypeLabelClassName} />
                            <LinkButton
                              size={ButtonSize.small}
                              to={getProblemSubmissionDetailsUrl({ submissionId: id })}
                              className={submissionBtnClass}
                              type={LinkButtonType.secondary}
                              text="Details"
                              state={buttonState}
                            />
                        </div>
                    </div>
                    <ExecutionResult
                      testRuns={submission.testRuns}
                      maxMemoryUsed={submission.maxMemoryUsed}
                      maxTimeUsed={submission.maxTimeUsed}
                      isCompiledSuccessfully={submission.isCompiledSuccessfully}
                      isProcessed={isProcessed}
                    />
                </div>
            );
        },
        [ selectedSubmission, submissionsTypeLabelClassName, isOfficial ],
    );

    return (
        <div className={containerClassName}>
            <List
              values={items}
              className={submissionsListClassName}
              itemClassName={submissionListItemClassName}
              itemFunc={renderSubmissionListItem}
              type={ListType.normal}
              orientation={Orientation.vertical}
              scrollable={false}
            />
        </div>
    );
};

export default SubmissionsList;

export type {
    ISubmissionsListProps,
};
