import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { isRegularUserInRoleForSubmission } from '../../../../common/submission-helpers';
import { ISubmissionDetailsReduxState } from '../../../../common/types';
import { ISubmissionResults } from '../../../../hooks/submissions/types';
import { useAuth } from '../../../../hooks/use-auth';
import { setCurrentSubmissionResults, setRetestIsSuccess, setSubmission } from '../../../../redux/features/submissionDetailsSlice';
import { useRetestSubmissionQuery } from '../../../../redux/services/submissionDetailsService';
import Button, { ButtonSize, ButtonType } from '../../../guidelines/buttons/Button';

import styles from './RetestButton.module.scss';

interface IRetestButtonProps {
    onSuccessfulRetest?: () => void;
}
const RetestButton = ({ onSuccessfulRetest }: IRetestButtonProps) => {
    const { state: { user } } = useAuth();

    const [ shouldNotRetestOnLoad, setShouldNotRetestOnLoad ] = useState(true);

    const { currentSubmission, currentSubmissionResults } = useSelector((state: {
            submissionDetails: ISubmissionDetailsReduxState;
        }) => state.submissionDetails);

    const { isSuccess } = useRetestSubmissionQuery(
        { id: Number(currentSubmission?.id) },
        { skip: shouldNotRetestOnLoad },
    );

    const dispatch = useDispatch();

    const resetSubmissionToUnprocessed = useCallback(() => {
        const unprocessedSubmission = { ...currentSubmission };
        unprocessedSubmission.isProcessed = false;

        // Copying objects because original objs are readonly
        const newSubmissionResults = { ...currentSubmissionResults };

        const predicate = (s: ISubmissionResults) => s.id === unprocessedSubmission.id;

        const submissionResultIndex = newSubmissionResults
            .items?.findIndex(predicate);

        if (!newSubmissionResults.items || isNil(submissionResultIndex)) {
            return;
        }

        const submissionResult = newSubmissionResults.items?.find(predicate) as ISubmissionResults;

        // Overwrite to be default unprocessed submission
        const newSubmissionResult = {
            ...submissionResult,
            isProcessed: false,
            isCompiledSuccessfully: false,
            points: 0,
            maxMemoryUsed: 0,
            maxTimeUsed: 0,
            testRuns: [],
            testRunsCount: 0,
        } as ISubmissionResults;

        const newItems = [ ...newSubmissionResults.items ];
        newItems[submissionResultIndex] = newSubmissionResult;
        newSubmissionResults.items = newItems;

        dispatch(setCurrentSubmissionResults(newSubmissionResults));
        dispatch(setSubmission(unprocessedSubmission));
    }, [ currentSubmission, currentSubmissionResults, dispatch ]);

    const handleOnClick = useCallback(() => {
        setShouldNotRetestOnLoad(false);
    }, []);

    useEffect(
        () => {
            if (isSuccess) {
                dispatch(setRetestIsSuccess(isSuccess));
                // Set submission to unprocessed so other components can hide info
                resetSubmissionToUnprocessed();

                if (!isNil(onSuccessfulRetest)) {
                    onSuccessfulRetest();
                }
            }
        },
        // Disable because otherwise a "Maximum update depth exceeded" error occurs
        // eslint-disable-next-line
        [ isSuccess ],
    );

    // Render if user is in admin or lecturer role for contest,
    // otherwise check if user is the participant of the submission
    // and if the submission can be retested
    return currentSubmission?.userIsInRoleForContest ||
            (!isNil(currentSubmission) &&
            isRegularUserInRoleForSubmission(currentSubmission, user.username) &&
            currentSubmission.isEligibleForRetest)
        ? (
            <Button
              type={ButtonType.secondary}
              size={ButtonSize.medium}
              onClick={handleOnClick}
              text="Retest"
              className={styles.retestButton}
            />
        )
        : null;
};

export default RetestButton;
