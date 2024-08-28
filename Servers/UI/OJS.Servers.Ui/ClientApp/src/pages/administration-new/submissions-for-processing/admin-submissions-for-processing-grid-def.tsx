import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { adminFormatDate } from '../../../utils/administration/administration-dates';

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        flex: 1,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'processed',
        headerName: 'Processed',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        flex: 1,
        filterable: false,
        sortable: false,
    },
    {
        field: 'processing',
        headerName: 'Processing',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        flex: 1,
        filterable: false,
        sortable: false,
    },
    {
        field: 'submissionId',
        headerName: 'Submission Id',
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <Link
              to={`/submissions/${Number(params.row?.submissionId)}/details`}
              target="_blank"
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
        type: 'date',
        width: 200,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => adminFormatDate(params.value),
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        headerAlign: 'center',
        type: 'date',
        width: 200,
        filterable: true,
        sortable: true,
        valueFormatter: (params) => adminFormatDate(params.value),
    },
];

export const returnSubmissionsForProcessingNonFilterableColumns = () => [] as GridColDef[];

export default dataColumns;
