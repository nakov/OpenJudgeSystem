/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import { ALLOW_PARALLEL_SUBMISSIONS_IN_TASKS, AUTO_CHANGE_TESTS_FEEDBACK_VISIBILITY, CATEGORY, CATEGORY_ID, CONTEST_PASSWORD, EDIT, END_TIME, ID, IS_DELETED, IS_VISIBLE, LIMIT_BETWEEN_SUBMISSIONS, NAME, START_TIME } from '../../../common/labels';
import { CONTEST_DELETE_CONFIRMATION_MESSAGE } from '../../../common/messages';
import { CONTESTS_PATH, NEW_ADMINISTRATION_PATH } from '../../../common/urls';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';

const contestFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: `${ID}`,
        flex: 0.5,
        type: 'number',
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'name',
        headerName: `${NAME}`,
        width: 200,
        flex: 2,
        headerAlign: 'center',
        type: 'string',
        align: 'center',
        filterable: false,
        sortable: false,
    },
    {
        field: 'category',
        headerName: `${CATEGORY}`,
        align: 'center',
        type: 'string',
        filterable: false,
        headerAlign: 'center',
        sortable: false,
        flex: 2,
    },
    {
        field: 'categoryId',
        headerName: `${CATEGORY_ID}`,
        flex: 0.5,
        align: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
    },
    {
        field: 'contestPassword',
        headerName: `${CONTEST_PASSWORD}`,
        width: 100,
        flex: 1,
        align: 'center',
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'startTime',
        headerName: `${START_TIME}`,
        width: 105,
        flex: 1.5,
        align: 'center',
        type: 'date',
        headerAlign: 'center',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value
            ? dayjs(params.value)
            : null,
    },
    {
        field: 'endTime',
        headerName: `${END_TIME}`,
        width: 105,
        flex: 1.5,
        align: 'center',
        type: 'date',
        headerAlign: 'center',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value
            ? dayjs(params.value)
            : null,
    },
    {
        field: 'limitBetweenSubmissions',
        headerName: `${LIMIT_BETWEEN_SUBMISSIONS}`,
        flex: 0,
        type: 'number',
        align: 'center',
        filterable: false,
        sortable: false,
    },
    {
        field: 'allowParallelSubmissionsInTasks',
        headerName: `${ALLOW_PARALLEL_SUBMISSIONS_IN_TASKS}`,
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'autoChangeTestsFeedbackVisibility',
        headerName: `${AUTO_CHANGE_TESTS_FEEDBACK_VISIBILITY}`,
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isDeleted',
        headerName: `${IS_DELETED}`,
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isVisible',
        headerName: `${IS_VISIBLE}`,
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
];

export const returnContestsNonFilterableColumns = (
    onEditClick: Function,
    deleteMutation: any,
) => [
    {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuickEditButton onEdit={() => onEditClick(Number(params.row.id))} />
                <RedirectButton path={`/${NEW_ADMINISTRATION_PATH}/${CONTESTS_PATH}/${Number(params.row.id)}`} location={EDIT} />
                <DeleteButton
                  id={Number(params.row.id)}
                  name={params.row.name}
                  text={CONTEST_DELETE_CONFIRMATION_MESSAGE}
                  mutation={deleteMutation}
                />
            </div>
        ),
    },
] as GridColDef[];

export default contestFilterableColumns;
