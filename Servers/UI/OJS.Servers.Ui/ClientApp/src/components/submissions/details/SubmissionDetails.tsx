import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ISubmissionDetailsReduxState } from '../../../common/types';
import { IErrorDataType } from '../../../hooks/use-http';
import { usePageTitles } from '../../../hooks/use-page-titles';
import NotFoundPage from '../../../pages/not-found/NotFoundPage';
import { setCurrentPage,
    setCurrentSubmissionResults,
    setRetestIsSuccess,
    setSubmission } from '../../../redux/features/submissionDetailsSlice';
import { useGetCurrentSubmissionQuery,
    useGetSubmissionResultsQuery } from '../../../redux/services/submissionDetailsService';
import concatClassNames from '../../../utils/class-names';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionResults from '../submission-results/SubmissionResults';

import RefreshableSubmissionList from './retest-btn/RefreshableSubmissionList';
import SubmissionResultsDetails from './submission-result-details/SubmissionResultsDetails';
import SubmissionDetailsCodeEditor from './submissionDetails-codeEditor/SubmissionDetailsCodeEditor';

import styles from './SubmissionDetails.module.scss';

const SubmissionDetails = () => {
    const { actions: { setPageTitle } } = usePageTitles();
    const dispatch = useDispatch();
    const { currentSubmission, validationErrors, currentPage } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);
    const { submissionId } = useParams();

    const {
        data: currentSubmissionData,
        isFetching,
        refetch: refetchCurrentSubmission,
    } = useGetCurrentSubmissionQuery({ submissionId: Number(submissionId) });

    const {
        data: allSubmissionsData,
        isFetching: isLoadingResults,
        refetch: refetchResults,
    } = useGetSubmissionResultsQuery({ submissionId: Number(submissionId), page: currentPage });

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
        refetchCurrentSubmission();
        refetchResults();
        dispatch(setRetestIsSuccess(false));
    }, [ dispatch, refetchCurrentSubmission, refetchResults ]);

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

    const submissionResults = useCallback(
        () => (isFetching
            ? (
                <div style={{ ...flexCenterObjectStyles }}>
                    <SpinningLoader />
                </div>
            )
            : (
                <div className={submissionDetailsClassName}>
                    <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                    { isNil(currentSubmission) || !currentSubmission.isProcessed
                        ? <span>Submission is not processed yet.</span>
                        : (
                            <SubmissionResults
                              testRuns={currentSubmission.testRuns}
                              compilerComment={currentSubmission?.compilerComment}
                              isCompiledSuccessfully={currentSubmission?.isCompiledSuccessfully}
                            />
                        )}
                </div>
            )
        ),
        [ isFetching, submissionDetailsClassName, detailsHeadingText, currentSubmission ],
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

    if (!isFetching && isNil(currentSubmission) && isEmpty(validationErrors)) {
        return <NotFoundPage />;
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
                <RefreshableSubmissionList reload={reloadPage} />
                <SubmissionDetailsCodeEditor />
                {submissionResults()}
            </div>
            {
                currentSubmission?.isProcessed
                    ? <SubmissionResultsDetails testRuns={currentSubmission?.testRuns} />
                    : null
            }
        </>
    );
};

export default SubmissionDetails;
