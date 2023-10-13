import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { usePages } from '../../../hooks/use-pages';
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
        actions: { setSubmissionResultsUrlParams },
    } = useSubmissionsDetails();
    const { state: { currentPage } } = usePages();

    const submissionsReloadBtnClassName = 'submissionReloadBtn';

    const handleReloadClick = useCallback(
        async () => {
            if (isNil(currentSubmission)) {
                return;
            }

            // eslint-disable-next-line prefer-destructuring
            const submissionId = currentSubmission.id;

            setSubmissionResultsUrlParams({
                submissionId,
                page: currentPage,
            });
        },
        [ currentPage, currentSubmission, setSubmissionResultsUrlParams ],
    );

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
