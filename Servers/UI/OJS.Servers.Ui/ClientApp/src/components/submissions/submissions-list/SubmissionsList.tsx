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
        () => concatClassNames(className),
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
    const submissionsLabelTypeClassName = 'submissionTypeLabel';

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

        return (
            <div className={itemClassName}>
                <div className={styles.infoContainer}>
                    <SubmissionResultPointsLabel
                      points={points}
                      maximumPoints={maximumPoints}
                      isProcessed={isProcessed}
                    />
                    <p className={styles.submissionCreatedOnParagraph}>{formatDate(new Date(createdOn))}</p>
                </div>
                <div className={styles.actionsContainer}>
                    <Text>
                        {submissionType}
                    </Text>
                    <Label type={LabelType.plain} text={typeLabelText} className={submissionsLabelTypeClassName} />
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
    }, [ selectedSubmission ]);

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
