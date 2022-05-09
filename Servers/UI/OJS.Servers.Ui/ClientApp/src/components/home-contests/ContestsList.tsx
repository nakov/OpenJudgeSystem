import React, { useCallback, useMemo } from 'react';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import List from '../guidelines/lists/List';
import { LinkButton } from '../guidelines/buttons/Button';
import { IIndexContestsType } from '../../common/types';

import styles from './ContestsList.module.scss';
import concatClassNames from '../../utils/class-names';
import { ContestState } from '../../common/contest-types';

interface IContestsListProps {
    title: string;
    contests: IIndexContestsType[];
    contestState?: ContestState;
}

const ContestsList = ({
    title,
    contests,
    contestState = ContestState.Active,
}: IContestsListProps) => {
    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const seeAllButtonClassName = useMemo(
        () => `btn-see-all-contests-${contestState}`,
        [ contestState ],
    );

    const contestsSeeAllButtonClassName = useMemo(
        () => concatClassNames(styles.contestsSeeAllButton, seeAllButtonClassName),
        [ seeAllButtonClassName ],
    );

    const allContestCardsContainerClassName = useMemo(
        () => `${contestState}-contests-cards-list`,
        [ contestState ],
    );

    const allContestsCardsContainer = useMemo(
        () => concatClassNames(styles.contestCardsContainer, allContestCardsContainerClassName),
        [ allContestCardsContainerClassName ],
    );

    const link = useMemo(
        () => `/contests?type=${contestState.toString()}`,
        [ contestState ],
    );

    return (
        <>
            <Heading>
                {title}
                {' '}
                Contests
            </Heading>
            <div id="index-contests-list" className={allContestsCardsContainer}>
                <List
                  values={contests}
                  itemFunc={renderContest}
                  orientation="horizontal"
                />
            </div>
            <LinkButton
              id="button-see-all-contests"
              to={link}
              text="See All"
              type="secondary"
              size="small"
              className={contestsSeeAllButtonClassName}
            />
        </>
    );
};

export default ContestsList;
