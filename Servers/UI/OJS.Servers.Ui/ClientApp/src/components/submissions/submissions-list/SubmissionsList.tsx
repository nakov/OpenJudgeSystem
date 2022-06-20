import { useCallback } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { ISubmissionDetails } from '../../../hooks/submissions/types';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import SubmissionResultPointsLabel from '../submission-result-points-label/SubmissionResultPointsLabel';
import { formatDate } from '../../../utils/dates';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';

import styles from './SubmissionsList.module.scss';

interface ISubmissionsListProps {
    items: any[];
    selectedSubmission: any;
}

const SubmissionsList = ({
    items,
    selectedSubmission,
}: ISubmissionsListProps) => {
    const navigate = useNavigate();

    const { setCurrentSubmissionId } = useSubmissionsDetails();

    const handleSubmissionClick = useCallback((submissionId: number) => {
        setCurrentSubmissionId(submissionId);
        navigate(`/submissions/${submissionId}/details`);
    }, [ navigate, setCurrentSubmissionId ]);

    const renderSubmissionListItem = useCallback((submissionDetails: ISubmissionDetails) => {
        const { id } = selectedSubmission || {};
        const selectedClassName = submissionDetails.id === id
            ? styles.selected
            : '';

        const className = concatClassNames(
            styles.submissionContainer,
            selectedClassName,
        );

        return (
            <div className={className}>
                <Button
                  type={ButtonType.plain}
                  onClick={() => handleSubmissionClick(submissionDetails.id)}
                >
                    {submissionDetails.submissionType}
                </Button>
                <div className={styles.labelContainer}>
                    <SubmissionResultPointsLabel
                      points={submissionDetails.points}
                      maximumPoints={submissionDetails.maximumPoints}
                      isProcessed={submissionDetails.isProcessed}
                    />
                </div>
                <p className={styles.submissionCreatedOnParagraph}>{formatDate(new Date(submissionDetails.createdOn))}</p>
            </div>
        );
    }, [ handleSubmissionClick, selectedSubmission ]);

    return (
        <List
          values={items}
          className={styles.submissionsList}
          itemClassName={styles.submissionListItem}
          itemFunc={renderSubmissionListItem}
          type={ListType.normal}
          orientation={Orientation.vertical}
          fullWidth
        />
    );
};

export default SubmissionsList;
