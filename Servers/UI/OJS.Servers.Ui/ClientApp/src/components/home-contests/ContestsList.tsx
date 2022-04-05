import * as React from 'react';
import { IIndexContestsType } from '../../hooks/contests/types';
import ContestCard from './contest-card/ContestCard';
import Heading from '../guidelines/headings/Heading';
import List from '../guidelines/lists/List';
import { LinkButton } from '../guidelines/buttons/Button';
import styles from './ContestsList.module.scss';

interface IContestsListProps {
    title: string;
    contests: IIndexContestsType[];
}

const ContestsList = ({
    title,
    contests,
}: IContestsListProps) => {
    const renderContest = (contest: IIndexContestsType) => (
        <ContestCard contest={contest} />
    );
    return (
        <>
            <Heading>
                {title}
                {' '}
                Contests
            </Heading>
            <div id="index-contests-list" className={styles.contestCardsContainer}>
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
              className={styles.contestsSeeAllButton}
            />
        </>
    );
};

export default ContestsList;
