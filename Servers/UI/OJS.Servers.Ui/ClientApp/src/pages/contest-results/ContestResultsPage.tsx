import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid, getGridNumericOperators, getGridStringOperators, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import isNil from 'lodash/isNil';

import { ContestParticipationType, ContestResultType } from '../../common/constants';
import { contestParticipationType } from '../../common/contest-helpers';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import {
    IContestResultsParticipationProblemType,
    IContestResultsParticipationType,
    IContestResultsProblemType,
    IContestResultsType,
} from '../../hooks/contests/types';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { useAuth } from '../../hooks/use-auth';
import { usePageTitles } from '../../hooks/use-page-titles';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestResultPage.module.scss';

interface IContestResultsTypeWithRowNumber extends IContestResultsParticipationType {
    rowNumber?: number;
}

const getBestSubmission = (
    params: GridRenderCellParams<number>,
    problem : IContestResultsProblemType,
) => {
    const problemResult = params.row.problemResults
        .find((pr: IContestResultsParticipationProblemType) => pr.problemId ===
        problem.id) as IContestResultsParticipationProblemType;
    const bestSubmission = problemResult?.bestSubmission;

    return bestSubmission ?? null;
};

const stringFilterOperators = getGridStringOperators().filter(({ value }) => [ 'equals', 'contains' ].includes(value));
const numericFilterOperators = getGridNumericOperators().filter(({ value }) => [ '=', '!=', '>', '<' ].includes(value));

const participantNamesColumns: GridColDef[] = [
    {
        field: 'participantUsername',
        headerName: 'Username',
        minWidth: 160,
        flex: 1,
        sortable: true,
        filterOperators: stringFilterOperators,
        headerClassName: styles.headerContent,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
            <div className={styles.columnContent}>
                {params.value}
            </div>
        ),
    },
    {
        field: 'participantFullName',
        headerName: 'Full name',
        type: 'string',
        minWidth: 100,
        flex: 1,
        sortable: false,
        filterable: true,
        filterOperators: stringFilterOperators,
        headerClassName: styles.headerContent,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
            <div className={styles.columnContent}>
                {params.value}
            </div>
        ),
    },
];

const rowNumberColumn: GridColDef = {
    field: 'rowNumber',
    headerName: 'Position',
    type: 'number',
    minWidth: 70,
    flex: 1,
    headerAlign: 'center',
    headerClassName: styles.headerContent,
    align: 'center',
    filterOperators: numericFilterOperators,
};

const totalResultColumn: GridColDef = {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    minWidth: 70,
    flex: 1,
    sortable: true,
    filterOperators: numericFilterOperators,
    headerAlign: 'center',
    headerClassName: styles.headerContent,
    align: 'center',
};

const ContestResultsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const { state: { user } } = useAuth();
    const { contestId, participationType: participationUrlType, resultType } = params;

    const official = participationUrlType === ContestParticipationType.Compete;
    const full = resultType === ContestResultType.Full;
    const [ numberedRows, setNumberedRows ] = useState<Array<IContestResultsTypeWithRowNumber>>([]);

    const participationType = contestParticipationType(official);

    const {
        state: {
            contestResults,
            contestResultsError,
            areContestResultsLoaded,
        },
        actions: { load },
    } = useCurrentContestResults();
    const { actions: { setPageTitle } } = usePageTitles();

    const contestResultsPageTitle = useMemo(
        () => isNil(contestResults)
            ? 'Loading'
            : `Results for ${contestResults.name}`,
        [ contestResults ],
    );

    const getProblemResultColumns = useCallback((results: IContestResultsType) => results.problems?.map((p) => ({
        field: `${p.id}`,
        headerName: p.name,
        description: p.name,
        type: 'number',
        minWidth: 50,
        flex: 1,
        sortable: true,
        valueGetter: (parameters: GridRenderCellParams<number>) => {
            const bestSubmission = getBestSubmission(parameters, p);
            return bestSubmission?.points ?? -1;
        },
        sortComparator: (v1: number, v2: number) => v1 - v2,
        filterable: false,
        headerAlign: 'center',
        headerClassName: styles.headerContent,
        align: 'center',
        renderCell: (cellParams: GridRenderCellParams<number>) => {
            const problemResult = cellParams.row.problemResults
                .find((pr: IContestResultsParticipationProblemType) => pr.problemId === p.id) as IContestResultsParticipationProblemType;
            const bestSubmission = problemResult?.bestSubmission;

            // User is admin or lecturer for contest or is the participant of the submission
            return (results.userIsInRoleForContest || cellParams.row.participantUsername === user.username) && !isNil(bestSubmission)
                ? (
                    <LinkButton
                      className={styles.pointsResult}
                      type={LinkButtonType.plain}
                      size={ButtonSize.small}
                      text={`${bestSubmission.points}`}
                      to={`/submissions/${bestSubmission.id}/details`}
                    />
                )
                : <p>{bestSubmission?.points || '-'}</p>;
        },
    } as GridColDef)), [ user ]);

    useEffect(
        () => setNumberedRows(contestResults?.results.map((row, index) => ({ ...row, rowNumber: index + 1 })) || []),

        [ contestResults ],
    );

    useEffect(
        () => {
            setPageTitle(contestResultsPageTitle);
        },
        [ contestResultsPageTitle, setPageTitle ],
    );

    const getColumns = useCallback(
        (results: IContestResultsType) => {
            const problemResultColumns = getProblemResultColumns(results) || [];

            return [ rowNumberColumn ]
                .concat(participantNamesColumns)
                .concat(problemResultColumns)
                .concat(totalResultColumn);
        },
        [ getProblemResultColumns ],
    );

    useEffect(
        () => {
            load(Number(contestId), official, full);
        },
        [ contestId, official, full, load ],
    );

    // github.com/SoftUni-Internal/exam-systems-issues/issues/228
    const renderElements = useMemo(
        () => (
            <>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestResultsHeading}
                >
                    {participationType}
                    {' '}
                    results for contests -
                    {' '}
                    {contestResults?.name}
                </Heading>
                <DataGrid
                  rows={numberedRows}
                  columns={getColumns(contestResults!)}
                  sx={{
                      '& .MuiDataGrid-columnHeaderTitle': {
                          whiteSpace: 'break-spaces',
                          lineHeight: 1,
                          textAlign: 'center',
                      },
                  }}
                  getRowId={(row) => row.participantUsername}
                />
            </>
        ),
        [ contestResults, getColumns, participationType, numberedRows ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingResults}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestResultsHeading}
                >
                    {message}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(contestResultsError)) {
                const { detail } = contestResultsError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ contestResultsError, renderErrorHeading ],
    );

    return (
        isNil(contestResultsError)
            ? areContestResultsLoaded
                ? renderElements
                : <div>Loading data</div>
            : renderErrorMessage()
    );
};

export default makePrivate(setLayout(ContestResultsPage));
