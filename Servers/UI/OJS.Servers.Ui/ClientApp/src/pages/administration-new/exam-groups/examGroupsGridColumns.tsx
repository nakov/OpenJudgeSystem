/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import DeleteButton from '../../../components/administration/common/delete/DeleteButton';

const examGroupsFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        headerAlign: 'center',
        flex: 0.5,
        width: 5,
        align: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'name',
        headerName: 'Name',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        filterable: false,
        sortable: false,
        flex: 2,
    },
    {
        field: 'contest',
        headerName: 'Contest',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        filterable: false,
        sortable: false,
        flex: 2,
    },
    {
        field: 'externalAppId',
        headerName: 'External App Id',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        filterable: false,
        sortable: false,
        flex: 0.5,
    },
    {
        field: 'externalExamGroupId',
        headerName: 'External ExamGroup Id',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        filterable: false,
        sortable: false,
        flex: 0.5,
    },
];

export const returnExamGroupsNonFilterableColumns = (
    onEditClick: Function,
    deleteMutation: any,
) => [
    {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton onClick={() => onEditClick(params.row.id)}>
                    <EditIcon color="warning" />
                </IconButton>
                <Link to={`/administration-new/exam-groups/${Number(params.row.id)}`}>
                    <ShortcutIcon color="primary" />
                </Link>
                <DeleteButton
                  id={Number(params.row.id)}
                  name={params.row.name}
                  text="Are you sure that you want to delete the exam group."
                  mutation={deleteMutation}
                />
            </div>
        ),
    },
] as GridColDef[];

export default examGroupsFilterableColumns;
