import React from 'react';
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { getDateWithFormat, preciseFormatDate } from '../../../utils/dates';

const dateGridColumnFormatter = (params : any) => getDateWithFormat(params.value);

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        width: 10,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'processed',
        headerName: 'Processed',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        width: 100,
        filterable: true,
        sortable: false,
    },
    {
        field: 'processing',
        headerName: 'Processing',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        width: 100,
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedException',
        headerName: 'Serialized Exception',
        align: 'center',
        headerAlign: 'center',
        width: 250,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedExecutionDetails',
        headerName: 'Serialized Execution Details',
        align: 'center',
        headerAlign: 'center',
        width: 250,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedExecutionResult',
        headerName: 'Serialized Execution Result',
        align: 'center',
        headerAlign: 'center',
        width: 300,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'submissionId',
        headerName: 'Submission ID',
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        width: 100,
        filterable: true,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => (
            <Link
              to={`/submissions/${Number(params.row?.submissionId)}/details`}
            >
                {params.row?.submissionId}
            </Link>
        ),
    },
    {
        field: 'createdOn',
        headerName: 'Created On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        width: 150,
        filterable: true,
        sortable: true,
        valueFormatter: dateGridColumnFormatter,
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        width: 150,
        filterable: true,
        sortable: true,
        valueFormatter: dateGridColumnFormatter,
    },
];

export default dataColumns;
