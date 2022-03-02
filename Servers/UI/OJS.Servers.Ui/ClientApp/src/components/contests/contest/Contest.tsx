import * as React from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import ContestMainNavigation from '../contest-main-navigation/ContestMainNavigation';
import styles from './Contest.module.scss';

const Contest = () => {
    const { currentContest } = useContests();

    return (
        <>
            <Heading type="primary" className={styles.contestHeading}>{currentContest?.name}</Heading>
            <div className={styles.contestWrapper}>
                <ContestTasksNavigation />
                <ContestMainNavigation />
            </div>
        </>
    );
};

export default Contest;
