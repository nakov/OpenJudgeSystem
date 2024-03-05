import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { preciseFormatDate } from '../../../utils/dates';

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        width: 10,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'processed',
        headerName: 'Processed',
        align: 'center',
        type: 'boolean',
        width: 200,
        filterable: true,
        sortable: false,
    },
    {
        field: 'processing',
        headerName: 'Processing',
        align: 'center',
        type: 'boolean',
        width: 200,
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedException',
        headerName: 'Serialized Exception',
        align: 'center',
        width: 200,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedExecutionDetails',
        headerName: 'Serialized Execution Details',
        align: 'center',
        width: 200,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'serializedExecutionResult',
        headerName: 'Serialized Execution Result',
        align: 'center',
        width: 200,
        type: 'string',
        filterable: true,
        sortable: false,
    },
    {
        field: 'submissionId',
        headerName: 'Submission ID',
        type: 'number',
        width: 200,
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
        type: 'dateTime',
        width: 200,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => preciseFormatDate(params.value?.createdOn),
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => preciseFormatDate(params.value?.modifiedOn),
    },
];

export default dataColumns;
