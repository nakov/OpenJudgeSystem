import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { isSubmissionEligibleForRetest, isUserInRoleForSubmission } from '../../../common/submission-helpers';
import { ISubmissionDetailsReduxState } from '../../../common/types';
import { useAuth } from '../../../hooks/use-auth';
import { IErrorDataType } from '../../../hooks/use-http';
import { usePageTitles } from '../../../hooks/use-page-titles';
import {
    setCurrentPage,
    setCurrentSubmissionResults,
    setSubmission,
} from '../../../redux/features/submissionDetailsSlice';
import {
    useGetCurrentSubmissionQuery,
    useGetSubmissionResultsQuery,
    useRetestSubmissionQuery,
} from '../../../redux/services/submissionDetailsService';
import concatClassNames from '../../../utils/class-names';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { Button, ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionResults from '../submission-results/SubmissionResults';

import RefreshableSubmissionList from './refreshable-submission-list/RefreshableSubmissionList';
import SubmissionResultsDetails from './submission-result-details/SubmissionResultsDetails';
import SubmissionDetailsCodeEditor from './submissionDetails-codeEditor/SubmissionDetailsCodeEditor';

import styles from './SubmissionDetails.module.scss';

const SubmissionDetails = () => {
    const { actions: { setPageTitle } } = usePageTitles();
    const { state: { user } } = useAuth();
    const dispatch = useDispatch();
    const { currentSubmission, validationErrors, currentPage } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);
    const { submissionId } = useParams();
    const { data: currentSubmissionData, isFetching, refetch } = useGetCurrentSubmissionQuery({ submissionId: Number(submissionId) });
    const { data: allSubmissionsData, isFetching: isLoadingResults, refetch: refetchResults } =
    useGetSubmissionResultsQuery({ submissionId: Number(submissionId), page: currentPage });
    const [ shouldNotRetestOnLoad, setShouldNotRetestOnLoad ] = useState(true);
    const {
        isFetching: retestIsFetching,
        isSuccess: retestIsSuccess,
    } = useRetestSubmissionQuery(
        { id: Number(submissionId) },
        { skip: shouldNotRetestOnLoad },
    );

    useEffect(() => () => {
        dispatch(setCurrentPage(1));
    }, [ dispatch ]);

    useEffect(() => {
        dispatch(setSubmission(currentSubmissionData));
        dispatch(setCurrentSubmissionResults(allSubmissionsData));
    }, [ currentSubmissionData, allSubmissionsData, dispatch ]);

    useEffect(
        () => {
            if (currentSubmission) {
                setPageTitle(`Submission №${currentSubmission.id}`);
            }
        },
        [ currentSubmission, setPageTitle ],
    );

    const reloadPage = useCallback(() => {
        refetch();
        refetchResults();
    }, [ refetch, refetchResults ]);

    const detailsHeadingText = useMemo(
        () => (
            <div style={{ marginBottom: '24px' }}>
                Details #
                {currentSubmission?.id}
            </div>
        ),
        [ currentSubmission?.id ],
    );

    const submissionsDetails = 'submissionDetails';
    const submissionDetailsClassName = concatClassNames(
        styles.navigation,
        styles.submissionDetails,
        submissionsDetails,
    );

    const renderRetestButton = useCallback(
        () => {
            if (isNil(currentSubmission) ||
                !isUserInRoleForSubmission(currentSubmission, user.username) ||
                !isSubmissionEligibleForRetest(currentSubmission)) {
                return null;
            }

            return (
                <Button
                  type={ButtonType.secondary}
                  size={ButtonSize.medium}
                  onClick={() => setShouldNotRetestOnLoad(false)}
                  text="Retest"
                  className={styles.retestButton}
                />
            );
        },
        [ currentSubmission, user.username, setShouldNotRetestOnLoad ],
    );

    const submissionResults = useCallback(
        () => (isFetching || retestIsFetching
            ? (
                <div style={{ ...flexCenterObjectStyles }}>
                    <SpinningLoader />
                </div>
            )
            : (
                <div className={submissionDetailsClassName}>
                    <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                    {isNil(currentSubmission)
                        ? ''
                        : (
                            <SubmissionResults
                              testRuns={currentSubmission.testRuns}
                              compilerComment={currentSubmission?.compilerComment}
                              isCompiledSuccessfully={currentSubmission?.isCompiledSuccessfully}
                            />
                        )}
                </div>
            )),
        [ isFetching, retestIsFetching, submissionDetailsClassName, detailsHeadingText, currentSubmission ],
    );

    const renderErrorMessage = useCallback(
        () => {
            const error = first(validationErrors as IErrorDataType[]);
            if (!isNil(error)) {
                const { detail } = error;
                return (
                    <div className={styles.headingContest}>
                        <Heading type={HeadingType.primary} className={styles.contestHeading}>
                            {detail}
                        </Heading>
                    </div>
                );
            }

            return null;
        },
        [ validationErrors ],
    );

    useEffect(
        () => {
            if (retestIsSuccess) {
                console.log(retestIsSuccess);
                reloadPage();
            }
        },
        [ reloadPage, retestIsSuccess ],
    );

    if (!isFetching && isNil(currentSubmission) && isEmpty(validationErrors)) {
        return <div>No details fetched.</div>;
    }

    if (!isEmpty(validationErrors)) {
        return renderErrorMessage();
    }

    if (isFetching || isLoadingResults) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }

    return (
        <>
            <div className={styles.detailsWrapper}>
                <RefreshableSubmissionList
                  renderRetestButton={renderRetestButton}
                  reload={reloadPage}
                />
                <SubmissionDetailsCodeEditor renderRetestButton={renderRetestButton} />
                {submissionResults()}
            </div>
            <SubmissionResultsDetails testRuns={currentSubmission?.testRuns} />
        </>
    );
};

export default SubmissionDetails;
