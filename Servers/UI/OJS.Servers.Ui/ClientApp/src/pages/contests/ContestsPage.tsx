import React from 'react';
import { useParams, use } from 'react-router';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import { ContestState, ContestType } from '../../common/contest-types';

interface IContestsPageParams {
    type: 'active' | 'past';
}

const ContestsPage = () => {
    const { state: { contests } } = useContests();
    const { type } = useSearchParams<IContestsPageParams>();

    console.log(contests);
    console.log(type);

    return (
        <h1>It works!</h1>
    );
};

export default setLayout(ContestsPage, true);
