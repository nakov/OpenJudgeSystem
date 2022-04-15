import * as React from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import ContestMainNavigation from '../contest-main-navigation/ContestMainNavigation';
import styles from './Contest.module.scss';
import { CONTEST_PARTICIPATION_TYPES, CONTEST_RESULT_TYPES } from '../../../common/constants';
import Hyperlink from '../../guidelines/buttons/Hyperlink';

const Contest = () => {
    const { currentContest, isContestParticipationOfficial } = useContests();
    const participationType = isContestParticipationOfficial
        ? CONTEST_PARTICIPATION_TYPES.COMPETE
        : CONTEST_PARTICIPATION_TYPES.PRACTICE;
    const resultsLink = `/contests/results/${currentContest?.id}/${participationType}/${CONTEST_RESULT_TYPES.SIMPLE}`;

    return (
        <>
            <div className={styles.contestHeadingWrapper}>
                <Heading type="primary" className={styles.contestHeading}>{currentContest?.name}</Heading>
                <Hyperlink to={resultsLink} text="Results" />
            </div>
            <div className={styles.contestWrapper}>
                <ContestTasksNavigation />
                <ContestMainNavigation />
            </div>
        </>
    );
};

export default Contest;
