import * as React from 'react';
import { useEffect } from 'react';
import { IIndexContestsType, useContests } from '../../hooks/contests/use-contests';
import { LinkButton } from '../guidelines/buttons/Button';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import { setLayout } from '../../pages/shared/set-layout';
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
            <Heading>
                {headerTitle}
                {' '}
                Contests
            </Heading>
            <div id="index-contests-list" className={styles.contestCardsContainer}>
                {renderContestsList(contests)}
            </div>
            <LinkButton
              id="button-see-all-contests"
              to="/contests"
              text="See All"
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

export default setLayout(HomeContests);
