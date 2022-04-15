import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useContests } from '../../hooks/contests/use-contests';
import Contest from '../../components/contests/contest/Contest';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';
import { CONTEST_PARTICIPATION_TYPES } from '../../common/constants';

interface IContestPageParamsProps {
    contestId: string
    participationType: string
}

const ContestPage = () => {
    const { contestId } = useParams<IContestPageParamsProps>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { participationType } = useParams<IContestPageParamsProps>();
    const { startContestParticipation } = useContests();

    useEffect(() => {
        (async () => {
            await startContestParticipation(Number(contestId), participationType === CONTEST_PARTICIPATION_TYPES.COMPETE);
        })();
    }, [ contestId, participationType, startContestParticipation ]);

    return (
        <Contest />
    );
};

export default makePrivate(setLayout(ContestPage));
