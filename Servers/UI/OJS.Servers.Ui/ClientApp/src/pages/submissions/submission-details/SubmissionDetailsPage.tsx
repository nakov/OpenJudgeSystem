import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import CodeEditor from '../../../components/code-editor/CodeEditor';
import MultiLineTextDisplay from '../../../components/common/MultiLineTextDisplay';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ErrorWithActionButtons from '../../../components/error/ErrorWithActionButtons';
import AdministrationLink from '../../../components/guidelines/buttons/AdministrationLink';
import Button, { ButtonSize, ButtonType } from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionTestRun from '../../../components/submissions/submission-test-run/SubmissionTestRun';
import SubmissionTestRuns from '../../../components/submissions/submission-test-runs/SubmissionTestRuns';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { setContestDetailsIdAndCategoryId } from '../../../redux/features/contestsSlice';
import {
    useGetSubmissionDetailsQuery,
    useLazyGetSubmissionUploadedFileQuery,
    useLazyRetestSubmissionQuery,
} from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { preciseFormatDate } from '../../../utils/dates';
import downloadFile from '../../../utils/file-download-utils';
import { getErrorMessage } from '../../../utils/http-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { makePrivate } from '../../shared/make-private';
import { setLayout } from '../../shared/set-layout';

import styles from './SubmissionsDetailsPage.module.scss';

const SubmissionDetailsPage = () => {
    const dispatch = useAppDispatch();
    const { submissionId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const [ isRetestingStarted, setIsRetestingStarted ] = useState(false);

    const { internalUser: user } = useAppSelector((state) => state.authorization);
    const { contestDetails } = useAppSelector((state) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [ downloadSolutionErrorMessage, setDownloadSolutionErrorMessage ] = useState<string>('');
    const { data, isLoading, error } = useGetSubmissionDetailsQuery({ id: Number(submissionId) });
    const [ downloadUploadedFile ] = useLazyGetSubmissionUploadedFileQuery();
    const [
        retestSubmission,
        {
            isLoading: retestIsLoading,
            isError: retestError,
            isSuccess: retestSuccess,
        },
    ] = useLazyRetestSubmissionQuery();

    // fetch submission details if not present (when opened from url directly)
    // in order to load breadcrumbs and name of contest properly
    useEffect(() => {
        if (!data?.contestId) {
            return;
        }
        if (!contestDetails || contestDetails?.id !== data?.contestId) {
            dispatch(setContestDetailsIdAndCategoryId({ id: data.contestId, categoryId: data.contestCategoryId }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data?.contestId ]);

    const { name } = contestDetails || {};
    const {
        id: solutionId,
        isProcessed,
        contestId,
        problem,
        user: contestUser,
        content,
        points,
        submissionType,
        testRuns,
        createdOn,
        isCompiledSuccessfully,
        compilerComment,
        isEligibleForRetest,
        modifiedOn,
        startedExecutionOn,
        completedExecutionOn,
        workerName,
        userIsInRoleForContest,
        isOfficial,
        maxPoints,
    } = data || {};

    const handleRetestSubmission = useCallback(() => {
        setIsRetestingStarted(true);
        retestSubmission({ id: solutionId! });
    }, [ retestSubmission, solutionId ]);

    const handleDownloadFile = useCallback(async () => {
        try {
            setDownloadSolutionErrorMessage('');
            const response = await downloadUploadedFile({ id: solutionId! });

            if (response.data) {
                downloadFile(response.data.blob, `submission-${solutionId}.zip`);
            }
        } catch {
            setDownloadSolutionErrorMessage('Error download solution submitted file!');
        }
    }, [ downloadUploadedFile, solutionId ]);

    const renderSolutionTitle = useCallback(() => (
        <div className={styles.solutionTitle}>
            Solution #
            {solutionId}
            {' '}
            by
            {' '}
            <Link to={`/profile/${contestUser?.userName}`}>
                {contestUser?.userName}
            </Link>
            {' '}
            for problem
            {' '}
            <Link to={`/contests/${contestId}/${isOfficial
                ? 'compete'
                : 'practice'}#${problem?.orderBy}`}
            >
                {problem?.name}
            </Link>
        </div>
    ), [ solutionId, contestUser?.userName, contestId, isOfficial, problem?.orderBy, problem?.name ]);

    const renderSolutionDetails = useCallback(() => {
        const { allowBinaryFilesUpload } = submissionType || {};
        /*
            The data will not be loaded when the submission is being retested.
            -> '!isRetestingStarted' - the submission's retesting has not been started,
                the data should be loaded.
            -> 'testRuns && testRuns.length !== 0' - if the tests' count is not 0, then the
                submission is not being retested, the data should be loaded.
            -> '!isCompiledSuccessfully' - if the submission is not compiled successfully,
                the data should be loaded.
         */
        const shouldLoadData = !isRetestingStarted && ((testRuns && testRuns.length !== 0) || !isCompiledSuccessfully);

        return (
            <>
                <div className={styles.submissionDetailsWrapper}>
                    <div>
                        {allowBinaryFilesUpload && (
                            <div className={styles.buttonWrapper}>
                                <Button
                                  id="download-submission"
                                  text="Download solution"
                                  onClick={handleDownloadFile}
                                />
                            </div>
                        )}
                        <div className={styles.detailsRow}>
                            <span>Strategy: </span>
                            {submissionType?.name}
                        </div>
                        <div className={styles.detailsRow}>
                            <span>
                                Submitted on:
                            </span>
                            <span>{preciseFormatDate(createdOn!)}</span>
                        </div>

                        {user.canAccessAdministration && (
                            <>
                                <div className={styles.detailsRow}>
                                    <span>Modified on:</span>
                                    {modifiedOn && shouldLoadData && <span>{preciseFormatDate(modifiedOn)}</span>}
                                </div>
                                <div className={styles.detailsRow}>
                                    <span>Started Execution on:</span>
                                    {startedExecutionOn && shouldLoadData && <span>{preciseFormatDate(startedExecutionOn)}</span>}
                                </div>
                                <div className={styles.detailsRow}>
                                    <span>Completed Execution on:</span>
                                    {completedExecutionOn && shouldLoadData && <span>{preciseFormatDate(completedExecutionOn)}</span>}
                                </div>
                                <div className={styles.detailsRow}>
                                    <span>Worker Executed on:</span>
                                    <span>{workerName}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {downloadSolutionErrorMessage &&
                    (<div className={styles.solutionDownloadFileErrorWrapper}>{downloadSolutionErrorMessage}</div>)}
            </>
        );
    }, [
        isRetestingStarted,
        testRuns,
        user.canAccessAdministration,
        submissionType,
        createdOn,
        downloadSolutionErrorMessage,
        handleDownloadFile,
        completedExecutionOn,
        modifiedOn,
        startedExecutionOn,
        isCompiledSuccessfully,
        workerName,
    ]);

    const renderSolutionTestDetails = useCallback(() => {
        const isSubmissionBeingProcessed =
            // The submission has not yet been processed
            !isProcessed ||
            // The retesting of the submission has been started
            isRetestingStarted ||
            // If the test runs' length is 0 and the code is compiled successfully, and the
            // submission is not eligible for retesting, then we are still processing the submission
            ((testRuns && testRuns.length === 0) && isCompiledSuccessfully && !isEligibleForRetest);
        if (isSubmissionBeingProcessed) {
            return (
                <div className={`${styles.submissionInQueueWrapper} ${textColorClassName}`}>
                    The submission is in queue and will be processed shortly. Please wait.
                </div>
            );
        }

        if (!isCompiledSuccessfully) {
            return (
                <div className={`${styles.compileTimeErrorWrapper} ${textColorClassName}`}>
                    <div>A compile time error occurred:</div>
                    { compilerComment && <MultiLineTextDisplay text={compilerComment} /> }
                </div>
            );
        }

        if (isEligibleForRetest) {
            return (
                <div className={`${styles.retestWrapper} ${textColorClassName}`}>
                    <div>
                        The input / output data changed. Your (
                        {points}
                        {' '}
                        /
                        {' '}
                        {maxPoints}
                        ) submission is now outdated. Click &quot;Retest&quot; to resubmit
                        your solution for re-evaluation against the new test cases. Your score may change.
                    </div>
                    <Button text="RETEST" onClick={() => handleRetestSubmission()} />
                </div>
            );
        }

        const sortByTrialTest = (a: ITestRunType, b: ITestRunType) => {
            if (a.isTrialTest && !b.isTrialTest) {
                return -1;
            }
            if (!a.isTrialTest && b.isTrialTest) {
                return 1;
            }
            return 0;
        };

        const sortedTestRuns = [ ...testRuns || [] ]?.sort(sortByTrialTest);

        return sortedTestRuns.map((testRun: ITestRunType, idx: number) => (
            <SubmissionTestRun
              key={`t-r-${testRun.testId}`}
              testRun={testRun}
              idx={idx + 1}
              shouldRenderAdminData={userIsInRoleForContest}
            />
        ));
    }, [
        isCompiledSuccessfully,
        isEligibleForRetest,
        points,
        testRuns,
        compilerComment,
        isProcessed,
        textColorClassName,
        userIsInRoleForContest,
        handleRetestSubmission,
        isRetestingStarted,
        maxPoints ]);

    const renderAdminButtons = useCallback(() => {
        const onViewCodeClick = () => {
            const scrollToElement =
                document.querySelector('#code-content-wrapper') ||
                document.querySelector('#download-submission');

            if (!scrollToElement) { return; }

            const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        };

        return (
            <div className={styles.adminButtonsWrapper}>
                <Button text="View Code" type={ButtonType.secondary} size={ButtonSize.small} onClick={onViewCodeClick} />
                { userIsInRoleForContest && (
                    <>
                        <AdministrationLink
                          text="Open In Administration"
                          to={`/submissions?filter=id~equals~${solutionId}`}
                        />
                        <AdministrationLink
                          text="Tests"
                          to={`/tests?filter=problemid~equals~${problem!.id}`}
                        />
                        <Button
                          text="Retest"
                          size={ButtonSize.small}
                          type={ButtonType.secondary}
                          onClick={() => handleRetestSubmission()}
                        />
                    </>
                )}
            </div>
        );
    }, [ handleRetestSubmission, problem, solutionId, userIsInRoleForContest ]);

    if (isLoading || retestIsLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }

    if (retestError) {
        return (
            <ErrorWithActionButtons
              message="Error retesting solution. Please try again!"
              backToUrl={`/submissions/${submissionId}/details`}
              backToText="Back to submission"
            />
        );
    }

    if (error) {
        return (
            <ErrorWithActionButtons
              message={getErrorMessage(error)}
              backToUrl="/submissions"
              backToText="Back to submissions"
            />
        );
    }

    return (
        <div className={`${styles.submissionsDetailsWrapper} ${textColorClassName}`}>
            { isRetestingStarted && retestSuccess && (
                <div className={styles.succesfulRetestWrapper}>
                    Submission retest started!
                </div>
            )}
            <ContestBreadcrumbs />
            <div>
                <div className={styles.submissionTitle}>
                    {renderSolutionTitle()}
                </div>
                <div className={styles.bodyWrapper}>
                    <SubmissionTestRuns testRuns={(!isRetestingStarted
                        ? testRuns
                        : []) || []}
                    />
                    <div className={styles.innerBodyWrapper}>
                        <Link to={`/contests/${contestId}`}>{name}</Link>
                        {renderAdminButtons()}
                        {renderSolutionTestDetails()}
                        {content && (
                            <div className={styles.codeContentWrapper} id="code-content-wrapper">
                                <div>Source Code</div>
                                <CodeEditor code={content} readOnly />
                            </div>
                        )}
                        {renderSolutionDetails()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default makePrivate(setLayout(SubmissionDetailsPage));
