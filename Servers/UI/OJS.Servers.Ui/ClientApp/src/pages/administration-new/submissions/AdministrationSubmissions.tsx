/* eslint-disable react/jsx-indent */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import { setAdminSubmissionsFilters, setAdminSubmissionsSorters } from '../../../redux/features/admin/submissionsAdminSlice';
import { useGetAllSubmissionsQuery, useRetestMutation } from '../../../redux/services/admin/submissionsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns from './admin-submissions-grid-def';

export const AdministrationSubmissionsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] =
        useState<IGetAllAdminParams>({
            page: 1,
            ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        });

    const selectedFilters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions']?.selectedSorters);

    const {
        data,
        error,
    } = useGetAllSubmissionsQuery(queryParams);

    const [ retest ] = useRetestMutation();

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
                    <IconButton
                      onClick={() => retest(Number(params.row.id))}
                    >
                        Retest
                    </IconButton>
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
          setSorterStateAction={setAdminSubmissionsSorters}
          setFilterStateAction={setAdminSubmissionsFilters}
          location="all-submissions"
        />
    );
};
