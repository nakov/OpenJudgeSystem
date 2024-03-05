/* eslint-disable @typescript-eslint/ban-types */
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import DeleteButton from '../../../components/administration/common/delete/DeleteButton';

const categoriesFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        headerAlign: 'center',
        flex: 0.5,
        width: 10,
        type: 'number',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'isDeleted',
        headerName: 'Is Deleted',
        headerAlign: 'center',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isVisible',
        headerName: 'Is Visible',
        headerAlign: 'center',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'name',
        headerName: 'Name',
        headerAlign: 'center',
        width: 200,
        flex: 2,
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'orderBy',
        headerName: 'Order By',
        headerAlign: 'center',
        flex: 0.5,
        align: 'left',
        type: 'number',
        filterable: false,
        sortable: false,
    },
    {
        field: 'parent',
        headerName: 'Parent',
        headerAlign: 'center',
        width: 150,
        flex: 2,
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'createdOn',
        headerName: 'Created On',
        headerAlign: 'center',
        width: 105,
        flex: 1,
        align: 'left',
        type: 'date',
        filterable: false,
        sortable: false,
    },
    {
        field: 'deletedOn',
        headerName: 'Deleted On',
        headerAlign: 'center',
        width: 105,
        flex: 1,
        align: 'left',
        type: 'date',
        filterable: false,
        sortable: false,
    },
    {
        field: 'modifiedOn',
        headerName: 'Modified On',
        headerAlign: 'center',
        width: 105,
        flex: 1,
        align: 'left',
        type: 'date',
        filterable: false,
        sortable: false,
    },
];

export const returnCategoriesNonFilterableColumns = (
    onEditClick: Function,
    deleteMutation: any,
) => [
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
                <IconButton onClick={() => onEditClick(params.row.id)}>
                    <EditIcon color="warning" />
                </IconButton>
                <DeleteButton
                  id={Number(params.row.id)}
                  name={params.row.name}
                  text="Are you sure that you want to delete the contest category?"
                  mutation={deleteMutation}
                />
            </div>
        ),
    },
] as GridColDef[];

export default categoriesFilterableColumns;
