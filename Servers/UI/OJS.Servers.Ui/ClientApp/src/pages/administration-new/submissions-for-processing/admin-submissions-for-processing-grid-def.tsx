import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { defaultDateTimeFormatPreciseTime, getDateWithFormat } from '../../../utils/dates';

const dateGridColumnFormatter = (params : any) => getDateWithFormat(params.value, defaultDateTimeFormatPreciseTime);

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
        headerName: 'Submission ID',
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        flex: 1,
        filterable: false,
        sortable: false,
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
        flex: 1,
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
        flex: 1,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
];

export default dataColumns;
