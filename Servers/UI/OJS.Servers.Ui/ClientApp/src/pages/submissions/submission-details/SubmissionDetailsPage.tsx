import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionTest from '../../../components/submissions/submission-test/SubmissionTest';
import SubmissionTestRuns from '../../../components/submissions/submission-test-runs/SubmissionTestRuns';
import { ITestRun } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import { useLazyGetContestByIdQuery } from '../../../redux/services/contestsService';
import { useGetSubmissionDetailsQuery, useLazyGetSubmissionUploadedFileQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { defaultDateTimeFormat, formatDate } from '../../../utils/dates';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './SubmissionsDetailsPage.module.scss';

const SubmissionDetailsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { submissionId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const { contestDetails } = useAppSelector((state) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [ downloadSolutionErrorMessage, setDownloadSolutionErrorMessage ] = useState<string>('');
    const { data, isLoading, error } = useGetSubmissionDetailsQuery({ id: Number(submissionId) });
    const [ getContestById ] = useLazyGetContestByIdQuery();
    const [ downloadUploadedFile ] = useLazyGetSubmissionUploadedFileQuery();

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
        user,
        content,
        points,
        submissionType,
        testRuns,
        createdOn,
        isCompiledSuccessfully,
        compilerComment,
        maxUsedMemory,
        isEligibleForRetest,
    } = data || {};

    const handleDownloadFile = useCallback(async () => {
        try {
            setDownloadSolutionErrorMessage('');
            const response = await downloadUploadedFile({ id: solutionId });

            if (response.data) {
                const blob = new Blob([ response.data.blob ]);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `submission-${solutionId}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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
            {user?.userName}
            {' '}
            for problem
            {' '}
            <span className={styles.problemName} onClick={() => navigate(`/contests/${contestId}`)}>
                {problem?.name}
            </span>
        </div>
    ), [ solutionId, user?.userName, problem?.name, contestId, navigate ]);

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
                            <span>{formatDate(createdOn, defaultDateTimeFormat)}</span>
                        </div>
                        <div className={styles.detailsRow}>
                            <span>Allowed memory:</span>
                            <span>
                                {(maxUsedMemory / 1000000).toFixed(2)}
                                {' '}
                                MB
                            </span>
                        </div>
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
        submissionType,
        createdOn,
        maxUsedMemory,
        downloadSolutionErrorMessage,
        handleDownloadFile,
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
                    <Button text="RETEST" onClick={() => {}} />
                </div>
            );
        }

        return testRuns.map((testRun: ITestRun, idx: number) => <SubmissionTest testRun={testRun} idx={idx + 1} />);
    }, [ isCompiledSuccessfully, isEligibleForRetest, points, testRuns, compilerComment ]);

    if (isLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }
    if (error) {
        return (<div>Error fetching submission data!</div>);
    }
    return (
        <div className={`${styles.submissionsDetailsWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div>
                <div className={styles.submissionTitle}>{name}</div>
                <div className={styles.bodyWrapper}>
                    <SubmissionTestRuns testRuns={testRuns} />
                    <div className={styles.innerBodyWrapper}>
                        {renderSolutionTitle()}
                        {renderSolutionTestDetails()}
                        { !isEligibleForRetest && content && (
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
