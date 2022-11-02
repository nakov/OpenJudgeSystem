import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { ContestParticipationType } from '../../common/constants';
import Contest from '../../components/contests/contest/Contest';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const ContestPage = () => {
    const {
        contestId,
        participationType,
    } = useParams();
    const { actions: { start } } = useCurrentContest();

    useEffect(() => {
        (async () => {
            const contest = {
                id: Number(contestId),
                isOfficial: participationType === ContestParticipationType.Compete,
            };

            await start(contest);
        })();
    }, [ contestId, participationType, start ]);

    return (
        <Contest />
    );
};

export default makePrivate(setLayout(ContestPage, true));
