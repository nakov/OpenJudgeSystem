import React, { useCallback, useEffect, useMemo } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import isNil from 'lodash/isNil';

import { ContestParticipationType, ContestResultType } from '../../common/constants';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { IContestResultsParticipationProblemType, IContestResultsType } from '../../hooks/contests/types';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { usePageTitles } from '../../hooks/use-page-titles';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

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
    const { state: { params } } = useRouteUrlParams();
    const { contestId, participationType, resultType } = params;

    const official = participationType === ContestParticipationType.Compete;
    const full = resultType === ContestResultType.Full;

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        state: { contestResults },
        actions: { load },
    } = useCurrentContestResults();
    const { actions: { setPageTitle } } = usePageTitles();

    const contestResultsPageTitle = useMemo(
        () => isNil(contestResults)
            ? 'Loading'
            : `Results for ${contestResults.name}`,
        [ contestResults ],
    );

    useEffect(() => {
        setPageTitle(contestResultsPageTitle);
    }, [ contestResultsPageTitle, setPageTitle ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // github.com/SoftUni-Internal/exam-systems-issues/issues/228
    return (
        <>
            {/* <Heading> */}
            {/*    {participationType} */}
            {/*    {' '} */}
            {/*    results for constest -*/}
            {/*    {' '} */}
            {/*    {contestResults.name} */}
            {/* </Heading> */}
            {/* <DataGrid */}
            {/*  rows={contestResults.results} */}
            {/*  columns={getColumns(contestResults)} */}
            {/*  disableSelectionOnClick */}
            {/*  getRowId={(row) => row.participantUsername} */}
            {/* /> */}
            <h1>this page should be fixed</h1>
        </>
    );
};

export default makePrivate(setLayout(ContestResultsPage));
