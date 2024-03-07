/* eslint-disable react/jsx-indent */
/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { VIEW } from '../../../common/labels';
import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import { NEW_ADMINISTRATION_PATH, SUBMISSIONS_FOR_PROCESSING_PATH } from '../../../common/urls';
import ViewRedirectButton from '../../../components/administration/common/edit/ViewRedirectButton';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import {
    setAdminSubmissionsFilters,
    setAdminSubmissionsSorters,
} from '../../../redux/features/admin/submissionsAdminSlice';
import { useGetAllSubmissionsQuery } from '../../../redux/services/admin/submissionsForProcessingAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns from './admin-submissions-for-processing-grid-def';

const AdministrationSubmissionsForProcessingPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] =
        useState<IGetAllAdminParams>({
            page: 1,
            itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        });

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const selectedFilters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions-for-processing']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminSubmissions['all-submissions-for-processing']?.selectedSorters);

    const {
        data,
        error,
        isLoading,
        isFetching,
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
                    <ViewRedirectButton
                      path={`/${NEW_ADMINISTRATION_PATH}/${SUBMISSIONS_FOR_PROCESSING_PATH}/${Number(params.row.id)}`}
                      location={VIEW}
                    />
                </div>
            ),
        },
    ];

    return (
        isLoading || isFetching
            ? <SpinningLoader />
            : (
                <AdministrationGridView
                  data={data}
                  error={error}
                  filterableGridColumnDef={dataColumns}
                  notFilterableGridColumnDef={nonFilterableColumns}
                  renderActionButtons={() => null}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  selectedFilters={selectedFilters || []}
                  selectedSorters={selectedSorters || []}
                  setSorterStateAction={setAdminSubmissionsSorters}
                  setFilterStateAction={setAdminSubmissionsFilters}
                  location="all-submissions-for-processing"
                />
            )
    );
};

export default AdministrationSubmissionsForProcessingPage;
