import React from 'react';
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PARTICIPANTS_PATH, PROBLEMS_PATH } from '../../../common/urls';
import { getDateWithFormat, preciseFormatDate } from '../../../utils/dates';

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        width: 10,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'isCompiledSuccessfully',
        headerName: 'Is Compiled Successfully',
        align: 'center',
        type: 'boolean',
        width: 200,
        filterable: false,
        sortable: false,
    },
    {
        field: 'processed',
        headerName: 'Processed',
        align: 'center',
        type: 'boolean',
        width: 100,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isDeleted',
        headerName: 'Is Deleted',
        align: 'center',
        type: 'boolean',
        filterable: false,
        sortable: false,
    },
    {
        field: 'processingComment',
        headerName: 'Processing Comment',
        align: 'center',
        width: 200,
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'problem',
        headerName: 'Problem',
        type: 'string',
        width: 200,
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <Link
              to={`${PROBLEMS_PATH}/${Number(params.row?.problem?.id)}`}
            >
                {params.row?.problem?.name}
            </Link>
        ),
    },
    {
        field: 'points',
        headerName: 'Points',
        align: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
    },
    {
        field: 'participant',
        headerName: 'Participant',
        align: 'center',
        type: 'string',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <Link
              to={`${PARTICIPANTS_PATH}/${Number(params.row?.participant?.id)}`}
            >
                {params.row?.participant?.userName}
            </Link>
        ),
    },
    {
        field: 'submissionType',
        headerName: 'Submission Type',
        align: 'center',
        type: 'string',
        width: 200,
        filterable: false,
        sortable: false,
        valueGetter: (params) => params.row?.submissionType?.name,
    },
    {
        field: 'isBinaryFile',
        headerName: 'Is File Content',
        align: 'center',
        type: 'boolean',
        width: 100,
        filterable: false,
        sortable: false,
    },
    {
        field: 'createdOn',
        headerName: 'Created On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => getDateWithFormat(params.value?.createdOn),
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => preciseFormatDate(params.value?.modifiedOn),
    },
    {
        field: 'startedExecutionOn',
        headerName: 'Started Execution On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => preciseFormatDate(params.value?.startedExecutionOn),
    },
    {
        field: 'completedExecutionOn',
        headerName: 'Completed Execution On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => preciseFormatDate(params.value?.completedExecutionOn),
    },
];

export default dataColumns;
