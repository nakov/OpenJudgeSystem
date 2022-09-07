import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import Contest from '../../components/contests/contest/Contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { ContestParticipationType } from '../../components/code-editor/common/constants';

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
