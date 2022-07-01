import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import { isNil } from 'lodash';
import { setLayout } from '../shared/set-layout';
import { makePrivate } from '../shared/make-private';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { ContestParticipationType, ContestResultType } from '../../common/constants';
import Heading from '../../components/guidelines/headings/Heading';
import { IContestResultsParticipationProblemType, IContestResultsType } from '../../hooks/contests/types';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';

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

const getProblemResultColumns = (results: IContestResultsType) => results.problems?.map((p) => ({
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

        return results.userHasContestRights && !isNil(bestSubmission)
            ? (
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  text={`${bestSubmission.points}`}
                  to={`/submissions/${bestSubmission.id}/details`}
                />
            )
            : <p>{bestSubmission?.points || '-'}</p>;
    },
} as GridColDef));

const ContestResultsPage = () => {
    const { contestId, participationType, resultType } = useParams();
    const official = participationType === ContestParticipationType.Compete;
    const full = resultType === ContestResultType.Full;

    const {
        state: { contestResults },
        actions: { load },
    } = useCurrentContestResults();

    const getColumns = useCallback((results: IContestResultsType) => {
        const problemResultColumns = getProblemResultColumns(results) || [];

        return participantNamesColumns
            .concat(problemResultColumns)
            .concat(totalResultColumn);
    }, []);

    useEffect(() => {
        (() => load(Number(contestId), official, full)
        )();
    }, [ contestId, official, full, load ]);

    return (
        <>
            <Heading>
                {participationType}
                {' '}
                results for constest -
                {' '}
                {contestResults.name}
            </Heading>
            <DataGrid
              rows={contestResults.results}
              columns={getColumns(contestResults)}
              disableSelectionOnClick
              getRowId={(row) => row.participantUsername}
            />
        </>
    );
};

export default makePrivate(setLayout(ContestResultsPage));
