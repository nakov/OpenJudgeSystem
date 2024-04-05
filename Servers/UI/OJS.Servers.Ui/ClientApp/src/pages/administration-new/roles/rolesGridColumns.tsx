/* eslint-disable @typescript-eslint/ban-types */
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { EDIT } from '../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../common/messages';
import { NEW_ADMINISTRATION_PATH, ROLES_PATH } from '../../../common/urls/administration-urls';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';

const rolesFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 2,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'name',
        headerName: 'Name',
        flex: 3,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
];

export const returnRolesNonFilterableColumns = (
    onEditClick: Function,
    deleteMutation: any,
    onDeleteSuccess?:() => void,
) => [
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuickEditButton onEdit={() => onEditClick(params.row.id)} />
                <RedirectButton path={`/${NEW_ADMINISTRATION_PATH}/${ROLES_PATH}/${params.row.id}`} location={`${EDIT} page`} />
                <DeleteButton
                  id={params.row.id}
                  name={params.row.name}
                  text={DELETE_CONFIRMATION_MESSAGE}
                  mutation={deleteMutation}
                  onSuccess={onDeleteSuccess}
                />
            </div>
        ),
    },
] as GridColDef[];

export default rolesFilterableColumns;
