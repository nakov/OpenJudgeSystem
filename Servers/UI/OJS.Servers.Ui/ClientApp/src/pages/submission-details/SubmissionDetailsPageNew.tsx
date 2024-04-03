import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import CodeEditor from '../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import Button from '../../components/guidelines/buttons/Button';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionTestRun from '../../components/submissions/submission-test-run/SubmissionTestRun';
import SubmissionTestRuns from '../../components/submissions/submission-test-runs/SubmissionTestRuns';
import { ITestRun } from '../../hooks/submissions/types';
import useTheme from '../../hooks/use-theme';
import { useGetSubmissionDetailsQuery } from '../../redux/services/submissionsService';
import { useAppSelector } from '../../redux/store';
import { defaultDateTimeFormat, formatDate } from '../../utils/dates';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import styles from './SubmissionsDetailsPageNew.module.scss';

const SubmissionDetailsPageNew = () => {
    const navigate = useNavigate();
    const { submissionId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const { contestDetails } = useAppSelector((state) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const { data, isLoading, error } = useGetSubmissionDetailsQuery({ id: Number(submissionId) });

    const { name, id: contestId } = contestDetails || {};
    const { id: solutionId, problem, user, content, submissionType, testRuns, createdOn } = data || {};

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
    ), [ solutionId, user?.userName, problem?.name ]);

    const renderSolutionDetails = useCallback(() => {
        const { allowBinaryFilesUpload } = submissionType || {};

        return (
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
                        <span>nz</span>
                    </div>
                </div>
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
                        <Button text="DOWNLOAD" onClick={() => {}} />
                    </div>
                )}
            </div>
        );
    }, [ submissionType, createdOn ]);

    const renderSolutionTestRuns = useCallback(() => testRuns.map((testRun: ITestRun) => <SubmissionTestRun testRun={testRun} />), [ testRuns ]);

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
            <div className={styles.submissionDetailsBody}>
                <div className={styles.submissionTitle}>{name}</div>
                <div className={styles.bodyWrapper}>
                    <SubmissionTestRuns testRuns={testRuns} />
                    <div className={styles.innerBodyWrapper}>
                        {renderSolutionTitle()}
                        {renderSolutionTestRuns()}
                        <div className={styles.codeContentWrapper}>
                            <div>Source Code</div>
                            <CodeEditor code={content} readOnly />
                        </div>
                        {renderSolutionDetails()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailsPageNew;
