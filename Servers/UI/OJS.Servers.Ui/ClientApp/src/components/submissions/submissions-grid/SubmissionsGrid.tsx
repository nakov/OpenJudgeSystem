import React, { useCallback } from 'react';

import { IPublicSubmission, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { format } from '../../../utils/number-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import styles from './SubmissionsGrid.module.scss';

const SubmissionsGrid = () => {
    const {
        state: {
            submissions,
            totalSubmissionsCount,
        },
    } = usePublicSubmissions();

    const renderSubmissionRow = useCallback(
        (submission: IPublicSubmission) => (
            <SubmissionGridRow submission={submission}/>
        ),
        [],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest {submissions.length} submissions out of {format(totalSubmissionsCount)} total
            </Heading>
            <List
                values={submissions}
                itemFunc={renderSubmissionRow}
                itemClassName={styles.submissionRow}
                fullWidth
            />
        </>
    );
};

export default SubmissionsGrid;
