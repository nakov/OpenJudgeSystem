import * as React from 'react';
import { useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { CONTEST_PARTICIPATION_TYPES, CONTEST_RESULT_TYPES } from '../../common/constants'
import Heading from '../../components/guidelines/headings/Heading';
import { IContestResultsParticipationProblemType, IContestResultsType } from '../../hooks/contests/types';
import Hyperlink from '../../components/guidelines/buttons/Hyperlink';
import _ from 'lodash';

interface IContestResultsPageParamsProps {
    contestId: string
    participationType: string
    resultType: string
}

const participantNamesColumns: GridColDef[] = [
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
        type: 'string',
        minWidth: 100,
        flex: 1,
        sortable: false,
    },
];

const totalResultColumn: GridColDef = {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    minWidth: 70,
    flex: 1,
    sortable: true,
};

const getColumns = (results: IContestResultsType) => {
    const problemResultColumns = useMemo(
        () => getProblemResultColumns(results) || [],
        [ results.problems ]
    );

    return participantNamesColumns
        .concat(problemResultColumns)
        .concat(totalResultColumn);
}

const getProblemResultColumns = (results: IContestResultsType) =>
    results.problems?.map((p) => ({
        field: `${p.id}`,
        headerName: p.name,
        description: p.name,
        type: 'number',
        minWidth: 70,
        flex: 1,
        sortable: true,
        renderCell: (params: GridRenderCellParams<number>) => {
            const problemResult = params.row.problemResults
                .find((pr: IContestResultsParticipationProblemType) => pr.problemId === p.id) as IContestResultsParticipationProblemType;
            const bestSubmission = problemResult?.bestSubmission;
            return results.userHasContestRights && !_.isNil(bestSubmission)
                ? <Hyperlink
                    text={`${bestSubmission.points}`}
                    to={`/submissions/${bestSubmission.id}`}
                />
                : <p>{bestSubmission?.points || '-'}</p>
        },
    } as GridColDef));

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

    return (
        <>
            <Heading>{resultType} {participationType} results for constest - {results.name}</Heading>
            <DataGrid
              rows={results.results}
              columns={getColumns(results)}
              disableSelectionOnClick
              getRowId={(row) => row.participantUsername}
            />
        </>
    );
};

export default makePrivate(setLayout(ContestResultsPage));