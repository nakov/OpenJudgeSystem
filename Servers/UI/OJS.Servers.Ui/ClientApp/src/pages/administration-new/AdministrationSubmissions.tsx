/* eslint-disable react/jsx-indent */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../common/types';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../redux/features/admin/contestsAdminSlice';
import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import AdministrationGridView from './AdministrationGridView';

export const AdministrationSubmissionsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] =
        useState<IGetAllAdminParams>({
            page: 1,
            ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        });

    const selectedFilters = useSelector((state: IRootStore) => state.adminContests['all-submissions']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminContests['all-submissions']?.selectedSorters);

    const {
        data,
        error,
    } = useGetAllAdminContestsQuery(queryParams);

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            type: 'number',
            filterable: true,
            sortable: true,
            valueFormatter: (params) => params.value.toString(),
        },
        {
            field: 'problem',
            headerName: 'Problem',
            type: 'string',
            filterable: true,
            sortable: true,
        },
        {
            field: 'problemId',
            headerName: 'Problem Id',
            type: 'number',
            filterable: true,
            sortable: true,
        },
        {
            field: 'processed',
            headerName: 'Processed',
            align: 'left',
            type: 'boolean',
            filterable: true,
            sortable: false,
        },
        {
            field: 'points',
            headerName: 'Points',
            align: 'left',
            type: 'number',
            filterable: true,
            sortable: true,
        },
        {
            field: 'isCompiledSuccessfully',
            headerName: 'Is Compiled Successfully',
            align: 'left',
            type: 'boolean',
            filterable: true,
            sortable: false,
        },
        {
            field: 'processingComment',
            headerName: 'Processing Comment',
            align: 'left',
            type: 'string',
            filterable: true,
            sortable: false,
        },
        {
            field: 'submissionType',
            headerName: 'Submission Type',
            align: 'left',
            type: 'string',
            filterable: true,
            sortable: true,
        },
        {
            field: 'participant',
            headerName: 'Participant',
            align: 'left',
            type: 'number',
            filterable: true,
            sortable: false,
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
            align: 'left',
            type: 'date',
            filterable: true,
            sortable: false,
        },
    ];

    const nonFilterableColumns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <p>No actions available</p>
                </div>
            ),
        },
    ];

    const renderGridActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            Grid actions here
        </div>
    );

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={dataColumns}
          notFilterableGridColumnDef={nonFilterableColumns}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminContestsSorters}
          setFilterStateAction={setAdminContestsFilters}
          location="all-submissions"
        />
    );
};
