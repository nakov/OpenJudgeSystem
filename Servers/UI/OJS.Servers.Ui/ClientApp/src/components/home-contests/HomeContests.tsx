import * as React from 'react';
import { useEffect, useState } from 'react';
import { IIndexContestsType, useContests } from '../../hooks/contests/use-contests';
import { LinkButton } from '../guidelines/buttons/Button';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import { setLayout } from '../../pages/shared/set-layout';
import styles from './HomeContests.module.scss';

const HomeContests = () => {
    const { activeContests, pastContests, getForHome } = useContests();
    const [ goToContestId, setGoToContestId ] = useState<string>();

    useEffect(() => {
        getForHome();
    }, [ getForHome ]);

    const renderContestsList = (contests: IIndexContestsType[]) => contests.map((contest: IIndexContestsType) => (
        <ContestCard contest={contest} />
    ));

    const renderGoToContest = () => (
        <>
            <input type="text" onChange={(e) => setGoToContestId(e.target.value)} />
            <LinkButton
              to={`/contests/${goToContestId}/compete`}
              text="Go To Contest"
              type="secondary"
              size="small"
            />
        </>
    );

    const render = (headerTitle: string, contests: IIndexContestsType[]) => (
        <>
            <Heading>
                {headerTitle}
                {' '}
                Contests
            </Heading>
            <div className={styles.contestCardsContainer}>
                {renderContestsList(contests)}
            </div>
            <LinkButton
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
            { renderGoToContest() }
        </>
    );
};

export default setLayout(HomeContests);
