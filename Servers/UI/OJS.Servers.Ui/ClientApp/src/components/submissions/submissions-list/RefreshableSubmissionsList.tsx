import React, { useCallback } from 'react';
import { isNil } from 'lodash';
import SubmissionsList, { ISubmissionsListBaseProps } from './SubmissionsList';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import Button, { ButtonType } from '../../guidelines/buttons/Button';

interface IRefreshableSubmissionsListProps extends ISubmissionsListBaseProps {
}

const RefreshablSubmissionsList = ({
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
    
    const btn = <Button
        onClick={handleReloadClick}
        text="Reload"
        type={ButtonType.secondary}
        className={submissionsReloadBtnClassName} />;
    
    return (
        <SubmissionsList
            items={items}
            selectedSubmission={selectedSubmission}
            className={className}
            refreshableButton={btn}
        />
    );
};

export default RefreshablSubmissionsList;
