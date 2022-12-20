import React, { useCallback, useMemo } from 'react';

import { IIndexContestsType } from '../../common/types';
import concatClassNames from '../../utils/class-names';
import { ButtonSize, LinkButton, LinkButtonType } from '../guidelines/buttons/Button';
import Heading from '../guidelines/headings/Heading';
import List, { Orientation } from '../guidelines/lists/List';

import ContestCard from './contest-card/ContestCard';

import styles from './ContestsList.module.scss';

interface IContestsListProps {
    title: string;
    contests: IIndexContestsType[];
    contestStatus?: number;
}

const ContestsList = ({
    title,
    contests,
    contestStatus,
}: IContestsListProps) => {
    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const seeAllButtonClassName = useMemo(
        () => `btn-see-all-contests-${contestStatus}`,
        [ contestStatus ],
    );

    const contestsSeeAllButtonClassName = useMemo(
        () => concatClassNames(styles.contestsSeeAllButton, seeAllButtonClassName),
        [ seeAllButtonClassName ],
    );

    const allContestCardsContainerClassName = useMemo(
        () => `${contestStatus}-contests-cards-list`,
        [ contestStatus ],
    );

    const allContestsCardsContainer = useMemo(
        () => concatClassNames(styles.contestCardsContainer, allContestCardsContainerClassName),
        [ allContestCardsContainerClassName ],
    );

    const link = useMemo(
        () => `/contests?status=${contestStatus}`,
        [ contestStatus ],
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
                  className={styles.contestList}
                  itemClassName={styles.contestListItem}
                  values={contests}
                  itemFunc={renderContest}
                  orientation={Orientation.horizontal}
                />
            </div>
            <LinkButton
              id="button-see-all-contests"
              to={link}
              text="See All"
              type={LinkButtonType.secondary}
              size={ButtonSize.small}
              className={contestsSeeAllButtonClassName}
            />
        </>
    );
};

export default ContestsList;
