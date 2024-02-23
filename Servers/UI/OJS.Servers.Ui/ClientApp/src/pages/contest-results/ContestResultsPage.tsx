import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, getGridNumericOperators, getGridStringOperators, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType, ContestResultType } from '../../common/constants';
import { contestParticipationType } from '../../common/contest-helpers';
import ContestBreadcrumb from '../../components/contests/contest-breadcrumb/ContestBreadcrumb';
import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import {
    IContestResultsParticipationProblemType,
    IContestResultsParticipationType,
    IContestResultsProblemType,
    IContestResultsType,
} from '../../hooks/contests/types';
import { useCurrentContestResults } from '../../hooks/contests/use-current-contest-results';
import { useContestCategories } from '../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../hooks/use-contest-categories-breadcrumb';
import { usePageTitles } from '../../hooks/use-page-titles';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { getContestDetailsAppUrl } from '../../utils/urls';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestResultPage.module.scss';

interface IContestResultsTypeWithRowNumber extends IContestResultsParticipationType {
    rowNumber?: number;
}

const getBestSubmission = (
    params: GridRenderCellParams<any>,
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
        valueGetter: (params) => params.value.trim(),
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
        valueGetter: (params) => params.value.trim(),
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
    const { internalUser: user } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const { contestId, participationType: participationUrlType, resultType } = params;
    const { state: { categoriesFlat, isLoaded }, actions: { load: loadCategories } } = useContestCategories();
    const { actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const official = participationUrlType === ContestParticipationType.Compete;
    const full = resultType === ContestResultType.Full;
    const [ numberedRows, setNumberedRows ] = useState<Array<IContestResultsTypeWithRowNumber>>([]);
    const [ isCategoriesRequestSent, setIsCategoriesRequestSent ] = useState(false);

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
        valueGetter: (parameters: GridRenderCellParams<any>) => {
            const bestSubmission = getBestSubmission(parameters, p);
            return bestSubmission?.points ?? -1;
        },
        sortComparator: (v1: number, v2: number) => v1 - v2,
        filterable: false,
        headerAlign: 'center',
        headerClassName: styles.headerContent,
        align: 'center',
        renderCell: (cellParams: GridRenderCellParams<any>) => {
            const problemResult = cellParams.row.problemResults
                .find((pr: IContestResultsParticipationProblemType) => pr.problemId === p.id) as IContestResultsParticipationProblemType;
            const bestSubmission = problemResult?.bestSubmission;

            // User is admin or lecturer for contest or is the participant of the submission
            return (results.userIsInRoleForContest || cellParams.row.participantUsername === user.userName) && !isNil(bestSubmission)
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

    useEffect(() => () => {
        setIsCategoriesRequestSent(false);
    }, []);

    useEffect(
        () => {
            setPageTitle(contestResultsPageTitle);
        },
        [ contestResultsPageTitle, setPageTitle, categoriesFlat, loadCategories, contestId ],
    );

    useEffect(
        () => {
            if (isEmpty(categoriesFlat) && !isCategoriesRequestSent) {
                setIsCategoriesRequestSent(true);
                (async () => {
                    await loadCategories();
                })();
            }
        },
        [ categoriesFlat, isCategoriesRequestSent, loadCategories ],
    );

    useEffect(
        () => {
            if (areContestResultsLoaded && !isEmpty(categoriesFlat)) {
                const category = categoriesFlat.find(({ id }) => id.toString() === contestResults?.categoryId.toString());
                updateBreadcrumb(category, categoriesFlat);
            }
        },
        [ categoriesFlat, contestResults, areContestResultsLoaded, updateBreadcrumb ],
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
                <div className={styles.breadcrumbContainer}>
                    <ContestBreadcrumb />
                </div>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestResultsHeading}
                >
                    {participationType}
                    {' '}
                    results for contest -
                    {' '}
                    <LinkButton
                      to={getContestDetailsAppUrl(contestId)}
                      text={contestResults?.name}
                      type={LinkButtonType.plain}
                      className={styles.contestName}
                    />
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
        [ participationType, contestId, contestResults, numberedRows, getColumns ],
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
            ? areContestResultsLoaded && isLoaded
                ? renderElements
                : (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
            : renderErrorMessage()
    );
};

export default makePrivate(setLayout(ContestResultsPage));
