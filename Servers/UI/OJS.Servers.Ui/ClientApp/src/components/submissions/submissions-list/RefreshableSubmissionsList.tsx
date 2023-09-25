import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE } from '../../../common/constants';
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
        actions: { setSubmissionDetailsResultsUrlParams },
    } = useSubmissionsDetails();

    const submissionsReloadBtnClassName = 'submissionReloadBtn';

    const handleReloadClick = useCallback(
        async () => {
            if (isNil(currentSubmission)) {
                return;
            }

            // eslint-disable-next-line prefer-destructuring
            const submissionId = currentSubmission.id;

            setSubmissionDetailsResultsUrlParams({
                submissionId,
                take: DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
            });
        },
        [ currentSubmission, setSubmissionDetailsResultsUrlParams ],
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
