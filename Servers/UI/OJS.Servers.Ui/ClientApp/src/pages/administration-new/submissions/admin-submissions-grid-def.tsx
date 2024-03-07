import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PARTICIPANTS_PATH, PROBLEMS_PATH } from '../../../common/urls';
import { defaultDateTimeFormatPreciseTime, getDateWithFormat } from '../../../utils/dates';

const dateGridColumnFormatter = (params : any) => getDateWithFormat(params.value, defaultDateTimeFormatPreciseTime);

const dataColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        flex: 0.5,
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
        flex: 1,
        filterable: false,
        sortable: false,
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
        field: 'isDeleted',
        headerName: 'Is Deleted',
        align: 'center',
        headerAlign: 'center',
        type: 'boolean',
        flex: 1,
        filterable: false,
        sortable: false,
    },
    {
        field: 'processingComment',
        headerName: 'Processing Comment',
        align: 'center',
        headerAlign: 'center',
        flex: 2,
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
        flex: 2,
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
        flex: 0.5,
        filterable: false,
        sortable: false,
    },
    {
        field: 'participant',
        headerName: 'Participant',
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        flex: 1,
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
        flex: 2,
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
        flex: 1,
        filterable: false,
        sortable: false,
    },
    {
        field: 'startedExecutionOn',
        headerName: 'Started Execution On',
        align: 'center',
        headerAlign: 'center',
        type: 'dateTime',
        flex: 2,
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
        flex: 2,
        filterable: false,
        sortable: false,
        valueFormatter: dateGridColumnFormatter,
    },
];

export default dataColumns;
