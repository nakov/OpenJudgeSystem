import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';

import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionTestRun from '../../../components/submissions/submission-test-run/SubmissionTestRun';
import SubmissionTestRuns from '../../../components/submissions/submission-test-runs/SubmissionTestRuns';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import { useLazyGetContestByIdQuery } from '../../../redux/services/contestsService';
import {
    useGetSubmissionDetailsQuery,
    useLazyGetCompeteRetestQuery,
    useLazyGetSubmissionUploadedFileQuery,
} from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { defaultDateTimeFormat, formatDate } from '../../../utils/dates';
import downloadFile from '../../../utils/file-download-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './SubmissionsDetailsPage.module.scss';

const SubmissionDetailsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { submissionId } = useParams();
    const { themeColors, getColorClassName } = useTheme();

    const { internalUser: user } = useAppSelector((state) => state.authorization);
    const { contestDetails } = useAppSelector((state) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [ downloadSolutionErrorMessage, setDownloadSolutionErrorMessage ] = useState<string>('');
    const { data, isLoading, error } = useGetSubmissionDetailsQuery({ id: Number(submissionId) });
    const [ getContestById ] = useLazyGetContestByIdQuery();
    const [ downloadUploadedFile ] = useLazyGetSubmissionUploadedFileQuery();
    const [ retestSubmission, { data: retestData, isLoading: retestIsLoading, error: retestError } ] = useLazyGetCompeteRetestQuery();

    // fetch submission details if not present (when opened from url directly)
    // in order to load breadcrumbs and name of contest properly
    useEffect(() => {
        if (!data?.contestId) {
            return;
        }
        if (!contestDetails || contestDetails?.id !== data?.contestId) {
            const fetchContestById = async () => {
                const { data: contestData } = await getContestById({ id: data?.contestId });
                dispatch(setContestDetails({ contest: contestData || null }));
            };
            fetchContestById();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data?.contestId ]);

    const { name } = contestDetails || {};
    const {
        id: solutionId,
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
    } = data || {};

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
            <Link to={`/contests/${contestId}`}>{problem?.name}</Link>
        </div>
    ), [ solutionId, contestUser?.userName, problem?.name, contestId ]);

    const renderSolutionDetails = useCallback(() => {
        const { allowBinaryFilesUpload } = submissionType || {};

        return (
            <>
                <div className={styles.submissionDetailsWrapper}>
                    <div>
                        <div className={styles.detailsRow}>
                            <span>
                                Submitted on:
                            </span>
                            <span>{formatDate(createdOn!, defaultDateTimeFormat)}</span>
                        </div>
                        { user.canAccessAdministration && (
                            <>
                                <div className={styles.detailsRow}>
                                    <span>Modified on:</span>
                                    { modifiedOn && <span>{formatDate(modifiedOn, defaultDateTimeFormat)}</span> }
                                </div>
                                <div className={styles.detailsRow}>
                                    <span>Started Execution on:</span>
                                    { startedExecutionOn && <span>{formatDate(startedExecutionOn, defaultDateTimeFormat)}</span> }
                                </div>
                                <div className={styles.detailsRow}>
                                    <span>Completed Execution on:</span>
                                    { completedExecutionOn && <span>{formatDate(completedExecutionOn, defaultDateTimeFormat)}</span> }
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <div className={styles.strategyWrapper}>
                            <span style={{
                                border: `2px solid ${themeColors.baseColor100}`,
                                color: `${themeColors.baseColor100}`,
                            }}
                            >
                                {submissionType?.name}
                            </span>
                        </div>
                        {allowBinaryFilesUpload && (
                        <div className={styles.buttonWrapper}>
                            <Button text="DOWNLOAD" onClick={handleDownloadFile} />
                        </div>
                        )}
                    </div>
                </div>
                {downloadSolutionErrorMessage &&
                    (<div className={styles.solutionDownloadFileErrorWrapper}>{downloadSolutionErrorMessage}</div>)}
            </>
        );
    }, [
        user.canAccessAdministration,
        submissionType,
        createdOn,
        downloadSolutionErrorMessage,
        handleDownloadFile,
        completedExecutionOn,
        modifiedOn,
        startedExecutionOn,
        themeColors.baseColor100,
    ]);

    const renderSolutionTestDetails = useCallback(() => {
        if (!isCompiledSuccessfully) {
            return (
                <div className={styles.compileTimeErrorWrapper}>
                    <div>A compile time error occurred:</div>
                    <div>{compilerComment}</div>
                </div>
            );
        }

        if (isEligibleForRetest) {
            return (
                <div className={styles.retestWrapper}>
                    <div>
                        The input/ output data changed. Your (
                        {points}
                        /100) submission is now outdated. Click &quot;Restart&quot; to resubmit
                        your solution for re-evaluation against the new test cases. Your score may change.
                    </div>
                    <Button text="RETEST" onClick={() => retestSubmission({ id: solutionId! })} />
                </div>
            );
        }

        return testRuns?.map((testRun: ITestRunType, idx: number) => <SubmissionTestRun testRun={testRun} idx={idx + 1} />);
    }, [ isCompiledSuccessfully, isEligibleForRetest, points, testRuns, compilerComment ]);

    const renderAdminButtons = useCallback(() => {
        const onViewCodeClick = () => {
            const scrollToElement = document.querySelector('[class*="codeContentWrapper"]');
            if (!scrollToElement) { return; }

            const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        };

        const goToAdministrationForContest = () => navigate(`/administration-new/contests/details/${contestId}`);

        return (
            <div className={styles.adminButtonsWrapper}>
                { content && <Button text="View Code" onClick={onViewCodeClick} /> }
                <Button text="Edit" onClick={goToAdministrationForContest} />
                <Button text="Delete" onClick={goToAdministrationForContest} />
                <Button text="Tests" onClick={goToAdministrationForContest} />
                <Button text="Retest" onClick={() => retestSubmission({ id: solutionId! })} />
            </div>
        );
    }, [ content, contestId, navigate ]);

    if (isLoading || retestIsLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }
    if (error || retestError) {
        return (
            <div>
                { retestError
                    ? 'Error retesting solution. Please try again!'
                    : 'Error fetching submission data!' }
            </div>
        );
    }
    if (retestData) {
        return (<div className={styles.succesfulRetestWrapper}>Submission has been retested successfully, reload page to refresh results.</div>);
    }
    return (
        <div className={`${styles.submissionsDetailsWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div>
                <div className={styles.submissionTitle}>
                    {renderSolutionTitle()}
                </div>
                <div className={styles.bodyWrapper}>
                    <SubmissionTestRuns testRuns={testRuns || []} />
                    <div className={styles.innerBodyWrapper}>
                        <Link to={`/contests/${contestId}`}>{name}</Link>
                        {user.canAccessAdministration && renderAdminButtons()}
                        {renderSolutionTestDetails()}
                        {!isEligibleForRetest && content && (
                            <div className={styles.codeContentWrapper}>
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

export default SubmissionDetailsPage;
