import * as React from 'react';
import { useMemo } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { CONTEST_PARTICIPATION_TYPES, CONTEST_RESULT_TYPES } from '../../common/constants'
import Heading from '../../components/guidelines/headings/Heading';
import { IContestResultsParticipationProblemType } from '../../hooks/contests/types';

interface IContestResultsPageParamsProps {
    contestId: string
    participationType: string
    resultType: string
}

const columns: GridColDef[] = [
    {
        field: 'participantUsername',
        headerName: 'Username',
        minWidth: 160,
        flex: 1,
        sortable: true,
    },
    {
        field: 'participantFullName',
        headerName: 'Full name',
        description: 'participantFullName',
        type: 'string',
        minWidth: 100,
        flex: 1,
        sortable: false,
    },
];

const ContestResultsPage = () => {
    const { contestId, participationType, resultType } = useParams<IContestResultsPageParamsProps>();
    const official = participationType === CONTEST_PARTICIPATION_TYPES.COMPETE;
    const full = resultType === CONTEST_RESULT_TYPES.FULL;

    const {
        state: { results },
        actions: { getResults },
    } = useCurrentContestResults();

    useEffect(() => {
        if (results.results.length) {
            return;
        }
        getResults(Number(contestId), official, full);
    }, [ results, getResults ]);

    const dynamicColumns = useMemo(() => results.problems?.map((p) => ({
            field: `${p.id}`,
            headerName: p.name,
            description: p.name,
            type: 'number',
            minWidth: 70,
            flex: 1,
            sortable: true,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.problemResults
                .find((pr: IContestResultsParticipationProblemType) => pr.problemId === p.id)
                ?.bestSubmission
                ?.points
        } as GridColDef)) || [], [results.problems]);

    const allColumns = columns
        .concat(dynamicColumns)
        .concat({
            field: 'total',
            headerName: 'Total',
            type: 'number',
            minWidth: 70,
            flex: 1,
            sortable: true,
        } as GridColDef);

    console.log(allColumns);

    return (
        <>
            <Heading>{resultType} {participationType} results for constest - {results.name}</Heading>
            <DataGrid
              rows={results.results}
              columns={allColumns}
              disableSelectionOnClick
              getRowId={(row) => row.participantUsername}
            />
        </>
    );
};

export default makePrivate(setLayout(ContestResultsPage));