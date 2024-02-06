/* eslint-disable react/jsx-indent */
/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import IconSize from '../../../components/guidelines/icons/common/icon-sizes';
import DownloadIcon from '../../../components/guidelines/icons/DownloadIcon';
import RefreshIcon from '../../../components/guidelines/icons/RefreshIcon';
import {
    setAdminSubmissionsFilters,
    setAdminSubmissionsSorters,
} from '../../../redux/features/admin/submissionsAdminSlice';
import { useGetAllSubmissionsQuery } from '../../../redux/services/admin/submissionsForProcessingAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns from './admin-submissions-for-processing-grid-def';

export const AdministrationSubmissionsForProcessingPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] =
        useState<IGetAllAdminParams>({
            page: 1,
            ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        });

    const selectedFilters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions-for-processing']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions-for-processing']?.selectedSorters);

    const {
        data,
        error,
    } = useGetAllSubmissionsQuery(queryParams);

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
                    No actions
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
          location="all-submissions-for-processing"
        />
    );
};
