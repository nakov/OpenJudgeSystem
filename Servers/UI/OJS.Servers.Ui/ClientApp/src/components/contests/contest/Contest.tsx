import * as React from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import SubmissionBox from '../submission-box/SubmissionBox';
import ContestProblemDetails from '../contest-problem-details/ContestProblemDetails';

import concatClassNames from '../../../utils/class-names';

import styles from './Contest.module.scss';

const Contest = () => {
    const { currentContest } = useContests();

    const navigationClassName = concatClassNames(
        styles.sizeTwo,
        styles.container,
    );

    const submissionBoxClassName = concatClassNames(
        styles.sizeRest,
        styles.container,
    );

    const problemInfoClassName = concatClassNames(
        styles.sizeThree,
        styles.container,
    );

    return (
        <>
            <div className={styles.headingContest}>
                <Heading type="primary" className={styles.contestHeading}>{currentContest?.name}</Heading>
            </div>

            <div className={styles.contestWrapper}>
                <div className={navigationClassName}>
                    <ContestTasksNavigation />
                </div>
                <div className={submissionBoxClassName}>
                    <SubmissionBox />
                </div>
                <div className={problemInfoClassName}>
                    <ContestProblemDetails />
                </div>
            </div>
        </>
    );
};

export default Contest;
