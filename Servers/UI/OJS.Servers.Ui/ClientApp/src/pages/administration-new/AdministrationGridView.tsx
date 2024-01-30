/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable func-style */
import React, { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Slide } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ActionCreatorWithPayload, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ExceptionData, IGetAllAdminParams, IPagedResultType } from '../../common/types';
import { DEFAULT_ROWS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import AdministrationFilters, { IAdministrationFilter, mapGridColumnsToAdministrationFilterProps } from './administration-filters/AdministrationFilters';
import AdministrationSorting, { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps } from './administration-sorting/AdministrationSorting';

import styles from './AdministrationStyles.module.scss';

interface IAdministrationGridViewProps<T> {

    filterableGridColumnDef: Array<GridColDef>;
    notFilterableGridColumnDef: Array<GridColDef>;
    data: IPagedResultType<T> | undefined;

    showFiltersAndSorters?: boolean;

    renderActionButtons: () => ReactNode;

   modals?: Array<{showModal:boolean; modal: (index: number) => ReactNode}>;

   error: ExceptionData[] | FetchBaseQueryError | SerializedError | undefined;

   queryParams: IGetAllAdminParams;
   setQueryParams: Function;

   selectedFilters: Array<IAdministrationFilter>;
   selectedSorters: Array<IAdministrationSorter>;
   setFilterStateAction: ActionCreatorWithPayload<unknown, string>;

   setSorterStateAction: ActionCreatorWithPayload<unknown, string>;

   location: string;
   withSearchParams?: boolean;
}

const AdministrationGridView = <T extends object >(props: IAdministrationGridViewProps<T>) => {
    const {
        filterableGridColumnDef,
        notFilterableGridColumnDef,
        data,
        showFiltersAndSorters = true,
        renderActionButtons,
        modals = [],
        error,
        queryParams,
        setQueryParams,
        selectedFilters,
        selectedSorters,
        setFilterStateAction,
        setSorterStateAction,
        location,
        withSearchParams = true,
    } = props;
    const [ searchParams, setSearchParams ] = useSearchParams();
    const getRowClassName = (isDeleted: boolean, isVisible: boolean) => {
        if (isDeleted) {
            return styles.redGridRow;
        } if (isVisible === false) {
            return styles.grayGridRow;
        }
        return '';
    };

    const renderGridSettings = () => {
        const sortingColumns = mapGridColumnsToAdministrationSortingProps(filterableGridColumnDef);
        const filtersColumns = mapGridColumnsToAdministrationFilterProps(filterableGridColumnDef);

        return (
            <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
                { renderActionButtons() }
                {showFiltersAndSorters && (
                <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between', width: '450px' }}>
                    <AdministrationFilters searchParams={searchParams} setSearchParams={setSearchParams} withSearchParams={withSearchParams} setStateAction={setFilterStateAction} selectedFilters={selectedFilters} columns={filtersColumns} location={location} />
                    <AdministrationSorting searchParams={searchParams} setSearchParams={setSearchParams} withSearchParams={withSearchParams} setStateAction={setSorterStateAction} selectedSorters={selectedSorters} columns={sortingColumns} location={location} />
                </div>
                )}
                <Box className={styles.legendBox}>
                    <Box className={styles.rowColorBox}>
                        <Box className={`${styles.colorBox} ${styles.deleted}`} />
                        <p className={styles.colorSeparator}>-</p>
                        <p>Deleted</p>
                    </Box>
                    <Box className={styles.rowColorBox}>
                        <Box className={`${styles.colorBox} ${styles.visible}`} />
                        <p className={styles.colorSeparator}>-</p>
                        <p>Not visible</p>
                    </Box>
                </Box>
            </div>
        );
    };

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div style={{ height: '745px' }}>
                {modals.map((m, i) => m.showModal && m.modal(i))}
                { renderGridSettings() }
                { error
                    ? <div className={styles.errorText}>Error loading data</div>
                    : (
                        <DataGrid
                          columns={[ ...filterableGridColumnDef, ...notFilterableGridColumnDef ]}
                          rows={data?.items ?? []}
                          rowCount={data?.totalCount ?? 0}
                          paginationMode="server"
                          onPageChange={(e) => {
                              setQueryParams({ ...queryParams, page: e + 1 });
                          }}
                          rowsPerPageOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                          onPageSizeChange={(itemsPerRow: number) => {
                              setQueryParams({ ...queryParams, ItemsPerPage: itemsPerRow });
                          }}
                          pageSize={queryParams.ItemsPerPage}
                          getRowClassName={(params) => getRowClassName(params.row.isDeleted, params.row.isVisible)}
                          initialState={{
                              columns: {
                                  columnVisibilityModel: {
                                      isDeleted: false,
                                      isVisible: true,
                                  },
                              },
                          }}
                        />
                    )}
            </div>
        </Slide>
    );
};

export default AdministrationGridView;
