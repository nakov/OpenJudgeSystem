import React, { useCallback, useMemo } from 'react';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import List from '../guidelines/lists/List';
import { LinkButton } from '../guidelines/buttons/Button';
import { IIndexContestsType } from '../../common/types';

import styles from './ContestsList.module.scss';
import concatClassNames from '../../utils/class-names';

interface IContestsListProps {
    title: string;
    contests: IIndexContestsType[];
}

const ContestsList = ({
    title,
    contests,
}: IContestsListProps) => {
    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );
    const seeAllButtonClassName = useMemo(
        () => `btn-see-all-contests-${title}`,
        [ title ],
    );
    const contestsSeeAllButtonClassName = useMemo(
        () => concatClassNames(styles.contestsSeeAllButton, seeAllButtonClassName),
        [ seeAllButtonClassName ],
    );
    const allContestCardsContainerClassName = useMemo(
        () => `${title}-contests-cards-list`,
        [ title ],
    );
    const allContestsCardsContainer = useMemo(
        () => concatClassNames(styles.contestCardsContainer, allContestCardsContainerClassName),
        [ allContestCardsContainerClassName ],
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
              to="/contests"
              text="See All"
              type="secondary"
              size="small"
              className={contestsSeeAllButtonClassName}
            />
        </>
    );
};

export default ContestsList;
