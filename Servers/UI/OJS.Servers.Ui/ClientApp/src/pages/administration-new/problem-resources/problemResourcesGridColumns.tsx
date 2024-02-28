/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';

const problemResourceFilterableColumns: GridColDef[] = [
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
        field: 'type',
        headerName: 'Type',
        flex: 0,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'fileExtension',
        headerName: 'File Extension',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'link',
        headerName: 'Link',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'orderBy',
        headerName: 'Order By',
        flex: 0,
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
];

export const returnProblemResourceNonFilterableColumns = (onEditClick: Function) => [
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
                {/* <DeleteButton
                  id={Number(params.row.id)}
                  name={`${PROBLEM_RESOURCE}`}
                  text={DELETE_CONFIRMATION_MESSAGE}
                  mutation={useDeleteProblemResourceMutation}
                /> */}
            </div>
        ),
    } ] as GridColDef[];
export default problemResourceFilterableColumns;
