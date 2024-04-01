import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionTestRuns from '../../components/submissions/submission-test-runs/SubmissionTestRuns';
import useTheme from '../../hooks/use-theme';
import { useGetSubmissionDetailsQuery } from '../../redux/services/submissionsService';
import { useAppSelector } from '../../redux/store';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import styles from './SubmissionsDetailsPageNew.module.scss';

const SubmissionDetailsPageNew = () => {
    const navigate = useNavigate();
    const { submissionId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const { contestDetails } = useAppSelector((state) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const { data, isLoading, error } = useGetSubmissionDetailsQuery({ id: Number(submissionId) });
    console.log('data => ', data);

    const { name, id: contestId } = contestDetails || {};
    const { id: solutionId, problem, user } = data || {};

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
                    <SubmissionTestRuns />
                    <div>
                        {renderSolutionTitle()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailsPageNew;
