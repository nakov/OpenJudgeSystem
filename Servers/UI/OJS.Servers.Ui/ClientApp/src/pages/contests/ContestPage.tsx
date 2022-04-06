import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useContests } from '../../hooks/contests/use-contests';
import Contest from '../../components/contests/contest/Contest';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';

interface IContestPageParamsProps {
    contestId: string
    participationType: string
}

const ContestPage = () => {
    const { contestId } = useParams<IContestPageParamsProps>();
    const { participationType } = useParams<IContestPageParamsProps>();
    const { startContestParticipation } = useContests();

    useEffect(() => {
        (async () => {
            await startContestParticipation(Number(contestId), participationType === 'compete');
        })();
    }, [ contestId, participationType, startContestParticipation ]);

    return (
        <Contest />
    );
};

export default makePrivate(setLayout(ContestPage));
