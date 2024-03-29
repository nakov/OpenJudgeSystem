/* eslint-disable @typescript-eslint/ban-types */
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridDeleteIcon, GridRenderCellParams } from '@mui/x-data-grid';

const lecturerInCategoriesFilterableColumns: GridColDef[] = [
    {
        field: 'contestCategoryId',
        headerName: 'Contest Category Id',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
        flex: 0.5,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'contestCategoryName',
        headerName: 'Contest Category Name',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        type: 'string',
        filterable: false,
        sortable: false,
        flex: 1,
    },
];

export const returnLecturerInCategoriesNonFilterableColumns = (removeFromRoleFunc?: Function) => [
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.5,
        width: 100,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {removeFromRoleFunc && (
                <Tooltip title="Remove from Category">
                    <IconButton onClick={() => removeFromRoleFunc(Number(params.row.contestCategoryId))}>
                        <GridDeleteIcon color="error" />
                    </IconButton>
                </Tooltip>
                )}
            </div>
        ),
    },
] as GridColDef[];

export default lecturerInCategoriesFilterableColumns;
