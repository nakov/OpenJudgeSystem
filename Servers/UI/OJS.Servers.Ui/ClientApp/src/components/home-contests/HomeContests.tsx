import * as React from 'react';
import { useEffect } from 'react';
import { IIndexContestsType, useContests } from '../../hooks/contests/use-contests';
import { LinkButton } from '../guidelines/buttons/Button';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import { setLayout } from '../../pages/shared/set-layout';
import styles from './HomeContests.module.scss';
import concatClassNames from '../../utils/class-names';

const HomeContests = () => {
    const { activeContests, pastContests, getForHome } = useContests();

    useEffect(() => {
        getForHome();
    }, [ getForHome ]);

    const renderContestsList = (contests: IIndexContestsType[]) => contests.map((contest: IIndexContestsType) => (
        <ContestCard key={contest.id} contest={contest} />
    ));

    const render = (headerTitle: string, contests: IIndexContestsType[]) => {
        const seeAllButtonClassName = `btn-see-all-contests-${headerTitle}`;
        const contestsSeeAllButtonClassName = concatClassNames(styles.contestsSeeAllButton, seeAllButtonClassName);
        const allContestCardsContainerClassName = `${headerTitle}-contests-cards-list`;
        const allContestsCardsContainer = concatClassNames(styles.contestCardsContainer, allContestCardsContainerClassName);
        return (
            <>
                <Heading>
                    {headerTitle}
                    {' '}
                    Contests
                </Heading>
                <div className={allContestsCardsContainer}>
                    {renderContestsList(contests)}
                </div>
                <LinkButton
                  to="/contests"
                  text="See All"
                  type="secondary"
                  size="small"
                  className={contestsSeeAllButtonClassName}
                />
            </>
        );
    };

    return (
        <>
            { render('Active', activeContests) }
            { render('Past', pastContests) }
        </>
    );
};

export default setLayout(HomeContests);
