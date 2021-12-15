import * as React from 'react';
import { useEffect } from 'react';
import { IIndexContestsType, useContests } from '../../hooks/use-contests';
import { Button } from '../guidelines/buttons/Button';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import styles from './HomeContests.module.scss';

const HomeContests = () => {
    const { activeContests, pastContests, getForHome } = useContests();

    useEffect(() => {
        getForHome();
    }, [ getForHome ]);

    const renderContestsList = (contests: IIndexContestsType[]) => contests.map((contest: IIndexContestsType) => (
        <ContestCard contest={contest} />
    ));

    const render = (headerTitle: string, contests: IIndexContestsType[]) => (
        <>
            <Heading className={styles.contestsHeading}>
                {headerTitle}
                {' '}
                Contests
            </Heading>
            <div className={styles.contestCardsContainer}>
                {renderContestsList(contests)}
            </div>
            <Button
              text="See All"
              onClick={() => {}}
              type="secondary"
              size="small"
              className={styles.contestsSeeAllButton}
            />
        </>
    );

    return (
        <>
            { render('Active', activeContests) }
            { render('Past', pastContests) }
        </>
    );
};

export default HomeContests;
