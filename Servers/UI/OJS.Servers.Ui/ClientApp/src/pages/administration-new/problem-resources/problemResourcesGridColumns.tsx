/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PROBLEM_RESOURCE } from '../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../common/messages';
import { PROBLEM_RESOURCES_PATH, PROBLEMS_PATH } from '../../../common/urls';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import DownloadIconButton from '../../../components/administration/common/download/DownloadIconButton';
import QuickEditButton from '../../../components/administration/common/edit/QuickEditButton';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';
import { useDeleteProblemResourceMutation } from '../../../redux/services/admin/problemResourcesAdminService';

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
        flex: 0.5,
        type: 'number',
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
        flex: 0,
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
        headerAlign: 'center',
        renderCell: (params) => <Link to={`${params.value}`}>{params.value}</Link>,
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
        field: 'problem',
        headerName: 'Problem',
        flex: 0.5,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <Link to={`${PROBLEMS_PATH}/${params.row.problemId}`}>
                {params.row.problemName}
            </Link>
        ),
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
        flex: 0.5,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuickEditButton onEdit={() => onEditClick(Number(params.row.id))} />
                <RedirectButton location="Edit page" path={`${PROBLEM_RESOURCES_PATH}/${Number(params.row.id)}`} />
                <DeleteButton
                  id={Number(params.row.id)}
                  name={`${PROBLEM_RESOURCE}`}
                  text={DELETE_CONFIRMATION_MESSAGE}
                  mutation={useDeleteProblemResourceMutation}
                />
                <DownloadIconButton
                  args={params.row.id}
                  mutation={useDeleteProblemResourceMutation}
                />
            </div>
        ),
    } ] as GridColDef[];
export default problemResourceFilterableColumns;
