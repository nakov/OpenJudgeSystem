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
import dataColumns from './grid-col-def';

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
