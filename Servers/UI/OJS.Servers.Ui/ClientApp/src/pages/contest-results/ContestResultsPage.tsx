import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useContests } from '../../hooks/contests/use-contests';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';

interface IContestResultsPageParamsProps {
    contestId: string
    participationType: string
    resultType: string
}

const ContestResultsPage = () => {
    const { contestId, participationType, resultType } = useParams<IContestResultsPageParamsProps>();

    return <h1>{participationType} Results for constest {contestId} of type {resultType}</h1>
};

export default makePrivate(setLayout(ContestResultsPage));