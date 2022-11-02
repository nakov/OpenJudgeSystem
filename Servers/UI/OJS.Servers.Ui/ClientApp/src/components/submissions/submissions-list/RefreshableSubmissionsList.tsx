import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import Button, { ButtonType } from '../../guidelines/buttons/Button';

import SubmissionsList, { ISubmissionsListProps } from './SubmissionsList';

type IRefreshableSubmissionsListProps = ISubmissionsListProps

const RefreshableSubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
}: IRefreshableSubmissionsListProps) => {
    const {
        state: { currentSubmission },
        actions: { getSubmissionResults },
    } = useSubmissionsDetails();

    const submissionsReloadBtnClassName = 'submissionReloadBtn';

    const handleReloadClick = useCallback(async () => {
        if (isNil(currentSubmission)) {
            return;
        }

        const { problem: { id: problemId }, isOfficial } = currentSubmission;

        await getSubmissionResults(problemId, isOfficial);
    }, [ currentSubmission, getSubmissionResults ]);

    return (
        <>
            <SubmissionsList
              items={items}
              selectedSubmission={selectedSubmission}
              className={className}
            />

            <Button
              onClick={handleReloadClick}
              text="Reload"
              type={ButtonType.secondary}
              className={submissionsReloadBtnClassName}
            />
        </>
    );
};

export default RefreshableSubmissionsList;
