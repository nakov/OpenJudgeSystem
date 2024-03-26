import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { NEW_ADMINISTRATION_PATH, PARTICIPANTS_PATH, PROBLEMS_PATH } from '../../../common/urls/administration-urls';
import { adminPreciseFormatDate } from '../../../utils/administration/administration-dates';

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
              to={`/${NEW_ADMINISTRATION_PATH}/${PROBLEMS_PATH}/${Number(params.row?.problem?.id)}`}
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
        field: 'createdOn',
        headerName: 'Created On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => adminPreciseFormatDate(params.value?.createdOn),
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        align: 'center',
        type: 'dateTime',
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => adminPreciseFormatDate(params.value?.modifiedOn),
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
        valueFormatter: (params) => adminPreciseFormatDate(params.value?.startedExecutionOn),
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
        valueFormatter: (params) => adminPreciseFormatDate(params.value?.completedExecutionOn),
    },
];

export default dataColumns;
