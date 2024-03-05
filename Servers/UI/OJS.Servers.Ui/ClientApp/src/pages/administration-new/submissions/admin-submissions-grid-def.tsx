import React from 'react';
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PARTICIPANTS_PATH, PROBLEMS_PATH } from '../../../common/urls';
import { getDateWithFormat } from '../../../utils/dates';

const dateGridColumnFormatter = (params : any) => getDateWithFormat(params.value);

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        width: 10,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'isCompiledSuccessfully',
        headerName: 'Is Compiled Successfully',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        width: 200,
        filterable: false,
        sortable: false,
    },
    {
        field: 'processed',
        headerName: 'Processed',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        width: 100,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isDeleted',
        headerName: 'Is Deleted',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        filterable: false,
        sortable: false,
    },
    {
        field: 'processingComment',
        headerName: 'Processing Comment',
        align: 'center',
        headerAlign: 'center',
        width: 200,
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'problem',
        headerName: 'Problem',
        align: 'center',
        headerAlign: 'center',
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
        headerAlign: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
    },
    {
        field: 'participant',
        headerName: 'Participant',
        align: 'center',
        headerAlign: 'center',
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
        headerAlign: 'center',
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
        headerAlign: 'center',
        type: 'boolean',
        width: 100,
        filterable: false,
        sortable: false,
    },
    {
        field: 'createdOn',
        headerName: 'Created On',
        align: 'center',
        headerAlign: 'center',
        type: 'date',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
    {
        field: 'startedExecutionOn',
        headerName: 'Started Execution On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
    {
        field: 'completedExecutionOn',
        headerName: 'Completed Execution On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
];

export default dataColumns;
