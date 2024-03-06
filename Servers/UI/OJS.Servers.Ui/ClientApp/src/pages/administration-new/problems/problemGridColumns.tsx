/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/react-in-jsx-scope */
import { FaCopy } from 'react-icons/fa';
import ReplayIcon from '@mui/icons-material/Replay';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { EDIT } from '../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../common/messages';
import { PROBLEMS_PATH } from '../../../common/urls';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';

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
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'problemGroupOrderBy',
        headerName: 'Problem Group Order By',
        flex: 0.5,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'problemGroup',
        headerName: 'Problem Group Type',
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

export const returnProblemsNonFilterableColumns = (
    onEditClick: Function,
    deleteMutation: any,
    onCopyProblem?: Function,
    retestProblem?: Function,
    onDeleteSuccess?:() => void,
) => [
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1.5,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuickEditButton onEdit={() => onEditClick(Number(params.row.id))} />
                <RedirectButton path={`${PROBLEMS_PATH}/${Number(params.row.id)}`} location={`${EDIT} page`} />
                <DeleteButton
                  id={Number(params.row.id)}
                  name={params.row.name}
                  text={DELETE_CONFIRMATION_MESSAGE}
                  mutation={deleteMutation}
                  onSuccess={onDeleteSuccess}
                />
                {retestProblem && (
                    <IconButton onClick={() => retestProblem(Number(params.row.id))}>
                        <ReplayIcon />
                    </IconButton>
                )}
                {onCopyProblem && (
                <Tooltip title="Copy">
                    <IconButton onClick={() => onCopyProblem(Number(params.row.id))}>
                        <FaCopy />
                    </IconButton>
                </Tooltip>
                )}
            </div>
        ),
    },
] as GridColDef[];

export default problemFilterableColums;
