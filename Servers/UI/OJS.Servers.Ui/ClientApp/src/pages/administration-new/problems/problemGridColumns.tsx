/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import DeleteProblem from '../../../components/administration/Problems/delete/DeleteProblem';

const problemFilterableColums: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 0,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'contest',
        headerName: 'Contest',
        flex: 2,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'problemGroupId',
        headerName: 'Problem Group Id',
        flex: 0.5,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'problemGroup',
        headerName: 'Problem Group',
        flex: 1,
        type: 'string',
        filterable: false,
        align: 'center',
        sortable: false,
        headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value === '') {
                return 'None';
            }
            return params.value.toString();
        },
    },
    {
        field: 'practiceTestsCount',
        headerName: 'Practice Tests',
        flex: 0.5,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'competeTestsCount',
        headerName: 'Compete Tests',
        flex: 0.5,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'isDeleted',
        headerName: 'Is Deleted',
        type: 'boolean',
        flex: 0.5,
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
];

export const returnProblemsNonFilterableColumns = (onEditClick: Function, retestProblem?: Function) => [
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
                <IconButton onClick={() => onEditClick(Number(params.row.id))}>
                    <EditIcon color="warning" />
                </IconButton>
                <Link to={`/administration-new/problems/${Number(params.row.id)}`}>
                    <ShortcutIcon color="primary" />
                </Link>
                <DeleteProblem
                  problemId={Number(params.row.id)}
                  problemName={params.row.name}
                  style={{ alignSelf: 'flex-end' }}
                />
                {retestProblem && (
                <IconButton onClick={() => retestProblem(Number(params.row.id))}>
                    <ReplayIcon />
                </IconButton>
                )}
            </div>
        ),
    },
] as GridColDef[];

export default problemFilterableColums;
