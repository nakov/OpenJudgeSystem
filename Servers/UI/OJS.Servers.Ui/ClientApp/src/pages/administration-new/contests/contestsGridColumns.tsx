/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import DeleteButton from '../../../components/administration/common/delete/DeleteButton';

const contestFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 0.5,
        type: 'number',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
        flex: 2,
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'category',
        headerName: 'Category',
        type: 'string',
        filterable: false,
        sortable: false,
        flex: 2,
    },
    {
        field: 'categoryId',
        headerName: 'Category Id',
        flex: 0.5,
        align: 'left',
        type: 'number',
        filterable: false,
        sortable: false,
    },
    {
        field: 'contestPassword',
        headerName: 'Contest Password',
        width: 100,
        flex: 2,
        align: 'left',
        type: 'string',
        filterable: false,
        sortable: false,
    },
    {
        field: 'startTime',
        headerName: 'Start Time',
        width: 105,
        flex: 1,
        align: 'left',
        type: 'date',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value
            ? dayjs(params.value)
            : null,
    },
    {
        field: 'endTime',
        headerName: 'End Time',
        width: 105,
        flex: 1,
        align: 'left',
        type: 'date',
        filterable: false,
        sortable: false,
        valueFormatter: (params) => params.value
            ? dayjs(params.value)
            : null,
    },
    {
        field: 'limitBetweenSubmissions',
        headerName: 'Limit Between Submissions',
        flex: 0,
        type: 'number',
        align: 'center',
        filterable: false,
        sortable: false,
    },
    {
        field: 'allowParallelSubmissionsInTasks',
        headerName: 'allowParallelSubmissionsInTasks',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'autoChangeTestsFeedbackVisibility',
        headerName: 'autoChangeTestsFeedbackVisibility',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isDeleted',
        headerName: 'Is Deleted',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
    {
        field: 'isVisible',
        headerName: 'Is Visible',
        type: 'boolean',
        flex: 0,
        filterable: false,
        sortable: false,
    },
];

export const returnContestsNonFilterableColumns = (
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
                <Link to={`/administration-new/contests/${Number(params.row.id)}`}>
                    <ShortcutIcon color="primary" />
                </Link>
                <DeleteButton
                  id={Number(params.row.id)}
                  name={params.row.name}
                  text="Are you sure that you want to delete the contest."
                  mutation={deleteMutation}
                />
            </div>
        ),
    },
] as GridColDef[];

export default contestFilterableColumns;
