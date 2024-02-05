/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

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

export const returnNonFilterableColumns = () => [
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
            </div>
        ),
    } ] as GridColDef[];

export default filterableColumns;
