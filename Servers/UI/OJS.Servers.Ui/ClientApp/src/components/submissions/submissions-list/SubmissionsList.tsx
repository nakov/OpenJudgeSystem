import React, { useCallback, useMemo } from 'react';

import { ContestParticipationType } from '../../../common/constants';
import { ISubmissionDetails, ISubmissionDetailsType } from '../../../hooks/submissions/types';
import concatClassNames from '../../../utils/class-names';
import { formatDate } from '../../../utils/dates';
import { IHaveOptionalClassName } from '../../common/Props';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Label, { LabelType } from '../../guidelines/labels/Label';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import Text from '../../guidelines/text/Text';
import SubmissionResultPointsLabel from '../submission-result-points-label/SubmissionResultPointsLabel';

import styles from './SubmissionsList.module.scss';

interface ISubmissionsListProps extends IHaveOptionalClassName {
    items: ISubmissionDetails[];
    selectedSubmission: ISubmissionDetailsType | null;
}

const SubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
}: ISubmissionsListProps) => {
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

    const renderSubmissionListItem = useCallback((submission: ISubmissionDetails) => {
        const { id: selectedSubmissionId } = selectedSubmission || {};
        const {
            id,
            points,
            maximumPoints,
            isProcessed,
            createdOn,
            submissionType,
            isOfficial,
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

        const typeLabelText = isOfficial
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice;

        console.log(`With format ${formatDate(createdOn)}`);
        console.log(`Without format ${createdOn}`);

        return (
            <div className={itemClassName}>
                <div className={styles.infoContainer}>
                    <SubmissionResultPointsLabel
                      points={points}
                      maximumPoints={maximumPoints}
                      isProcessed={isProcessed}
                    />
                    <p className={styles.submissionCreatedOnParagraph}>{formatDate(createdOn)}</p>
                </div>
                <div className={styles.actionsContainer}>
                    <Text className={styles.submissionTypeText}>
                        {submissionType}
                    </Text>
                    <Label type={LabelType.plain} text={typeLabelText} className={submissionsTypeLabelClassName} />
                    <LinkButton
                      size={ButtonSize.small}
                      to={`/submissions/${id}/details`}
                      className={submissionBtnClass}
                      type={LinkButtonType.secondary}
                      text="Details"
                      state={buttonState}
                    />
                </div>
            </div>
        );
    }, [ selectedSubmission, submissionsTypeLabelClassName ]);

    return (
        <div className={containerClassName}>
            <List
              values={items}
              className={submissionsListClassName}
              itemClassName={submissionListItemClassName}
              itemFunc={renderSubmissionListItem}
              type={ListType.normal}
              orientation={Orientation.vertical}
              fullWidth
              scrollable={false}
            />
        </div>
    );
};

export default SubmissionsList;

export type {
    ISubmissionsListProps,
};
