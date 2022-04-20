import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { CONTEST_PARTICIPATION_TYPES, CONTEST_RESULT_TYPES } from '../../common/constants'

interface IContestResultsPageParamsProps {
    contestId: string
    participationType: string
    resultType: string
}

const ContestResultsPage = () => {
    const { contestId, participationType, resultType } = useParams<IContestResultsPageParamsProps>();
    const official = participationType === CONTEST_PARTICIPATION_TYPES.COMPETE;
    const full = resultType === CONTEST_RESULT_TYPES.FULL;

    const {
        state: { results },
        actions: { getResults },
    } = useCurrentContestResults();

    useEffect(() => {
        if (!results.id) {
            getResults(Number(contestId), official, full);
        }
    }, [ results.id, getResults ]);

    return <h1>{participationType} Results for constest {contestId} of type {resultType}</h1>
};

export default makePrivate(setLayout(ContestResultsPage));