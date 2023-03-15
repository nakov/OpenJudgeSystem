import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import Button, { ButtonType } from '../../guidelines/buttons/Button';

import SubmissionsList, { ISubmissionsListProps } from './SubmissionsList';

interface IRefreshableSubmissionsListProps extends ISubmissionsListProps{
    renderExternalElements?: () => React.ReactElement;
}

const RefreshableSubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
    renderExternalElements,
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

    const renderReloadButton = useCallback(
        () => (
            <Button
              onClick={handleReloadClick}
              text="Reload"
              type={ButtonType.secondary}
              className={submissionsReloadBtnClassName}
            />
        ),
        [ handleReloadClick ],
    );

    return (
        <>
            <SubmissionsList
              items={items}
              selectedSubmission={selectedSubmission}
              className={className}
            />

            {!isNil(renderExternalElements)
                ? renderExternalElements()
                : renderReloadButton()}
        </>
    );
};
export default RefreshableSubmissionsList;
