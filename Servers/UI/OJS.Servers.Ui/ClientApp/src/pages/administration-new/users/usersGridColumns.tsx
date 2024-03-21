/* eslint-disable @typescript-eslint/ban-types */
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { EDIT } from '../../../common/labels';
import { NEW_ADMINISTRATION_PATH, USERS_PATH } from '../../../common/urls/administration-urls';
import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';
import { adminFormatDate } from '../../../utils/administration/administration-dates';

const usersFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'userName',
        headerName: 'User Name',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'firstName',
        headerName: 'First Name',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'lastName',
        headerName: 'Last Name',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'city',
        headerName: 'City',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'dateOfBirth',
        headerName: 'Date of birth',
        flex: 1,
        type: 'date',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => adminFormatDate(params.value),
    },
    {
        field: 'age',
        headerName: 'Age',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
];

export const returnUsersNonFilterableColumns = (onEditClick: Function) => [
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
                <RedirectButton path={`/${NEW_ADMINISTRATION_PATH}/${USERS_PATH}/${params.row.id}`} location={`${EDIT} page`} />
            </div>
        ),
    },
] as GridColDef[];

export default usersFilterableColumns;
