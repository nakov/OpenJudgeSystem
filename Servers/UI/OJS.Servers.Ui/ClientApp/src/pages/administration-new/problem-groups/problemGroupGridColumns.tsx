/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { EDIT, PROBLEM_GROUP } from '../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../common/messages';
import { PROBLEM_GROUPS_PATH } from '../../../common/urls';
import DeleteButton from '../../../components/administration/common/buttons/delete/DeleteButton';
import EditRedirectButton from '../../../components/administration/common/buttons/edit/EditRedirectButton';
import QuickEditButton from '../../../components/administration/common/buttons/edit/QuickEditButton';
import { useDeleteProblemGroupMutation } from '../../../redux/services/admin/problemGroupsAdminService';

const filterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => params.value.toString(),
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
        field: 'isDeleted',
        headerName: 'Is Deleted',
        flex: 1,
        type: 'boolean',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'orderBy',
        headerName: 'Order By',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'type',
        headerName: 'Type',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value === '') {
                return 'None';
            }
            return params.value.toString();
        },
    },
];

export const returnNonFilterableColumns = (onEditClick: Function) => [
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
                <QuickEditButton onEdit={() => onEditClick(Number(params.row.id))} />
                <EditRedirectButton path={`${PROBLEM_GROUPS_PATH}/${Number(params.row.id)}`} location={`${EDIT} page`} />
                <DeleteButton
                  id={Number(params.row.id)}
                  name={`${PROBLEM_GROUP}`}
                  text={DELETE_CONFIRMATION_MESSAGE}
                  mutation={useDeleteProblemGroupMutation}
                />
            </div>
        ),
    } ] as GridColDef[];

export default filterableColumns;
