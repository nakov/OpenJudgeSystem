import React, { useEffect } from 'react';

import { ContestParticipationType } from '../../common/constants';
import Contest from '../../components/contests/contest/Contest';
import { useInternalUrlParams } from '../../hooks/common/use-internal-url-params';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const ContestPage = () => {
    const { state: { params } } = useInternalUrlParams();

    const {
        contestId,
        participationType,
    } = params;
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
