import * as React from 'react';
import { useCallback } from 'react';
import { ISubmissionDetails } from '../../../hooks/submissions/types';
import concatClassNames from '../../../utils/class-names';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import SubmissionResultPointsLabel from '../submission-result-points-label/SubmissionResultPointsLabel';
import { formatDate } from '../../../utils/dates';
import List, { ListType, Orientation } from '../../guidelines/lists/List';

import styles from './SubmissionsList.module.scss';
import Text from '../../guidelines/text/Text';

interface ISubmissionsListProps {
    items: any[];
    selectedSubmission: any;
}

const SubmissionsList = ({
    items,
    selectedSubmission,
}: ISubmissionsListProps) => {
    const renderSubmissionListItem = useCallback((submission: ISubmissionDetails) => {
        const { id: selectedSubmissionId } = selectedSubmission || {};
        const {
            id,
            points,
            maximumPoints,
            isProcessed,
            createdOn,
            submissionType,
        } = submission;
        const isSelectedSubmission = id === selectedSubmissionId;
        const selectedClassName = isSelectedSubmission
            ? styles.selected
            : '';

        const className = concatClassNames(
            styles.submissionContainer,
            selectedClassName,
        );

        const buttonState = isSelectedSubmission
            ? ButtonState.disabled
            : ButtonState.enabled;

        return (
            <div className={className}>
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
                    <LinkButton
                      size={ButtonSize.small}
                      to={`/submissions/${id}/details`}
                      type={LinkButtonType.secondary}
                      text="Details"
                      state={buttonState}
                    />
                </div>
            </div>
        );
    }, [ selectedSubmission ]);

    return (
        <List
          values={items}
          className={styles.submissionsList}
          itemClassName={styles.submissionListItem}
          itemFunc={renderSubmissionListItem}
          type={ListType.normal}
          orientation={Orientation.vertical}
          fullWidth
          scrollable
        />
    );
};

export default SubmissionsList;
