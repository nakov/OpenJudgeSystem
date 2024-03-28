// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable func-style */
import React, { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Box, IconButton, Slide, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { ActionCreatorWithPayload, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ExceptionData, IGetAllAdminParams, IPagedResultType } from '../../common/types';
import ExportExcel from '../../components/administration/common/export-excel/ExportExcel';
import LegendBox from '../../components/administration/common/legendBox/LegendBox';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ROWS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import AdministrationFilters, { IAdministrationFilter, mapGridColumnsToAdministrationFilterProps } from './administration-filters/AdministrationFilters';
import AdministrationSorting, { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps } from './administration-sorting/AdministrationSorting';

import styles from './AdministrationStyles.module.scss';

interface IAdministrationGridViewProps<T> {

    filterableGridColumnDef: Array<GridColDef>;
    notFilterableGridColumnDef: Array<GridColDef>;
    data: IPagedResultType<T> | undefined;

    showFiltersAndSorters?: boolean;

    renderActionButtons?: () => ReactNode;

   modals?: Array<{showModal:boolean; modal: (index: number) => ReactNode}>;

   error: ExceptionData[] | FetchBaseQueryError | SerializedError | undefined;
   queryParams?: IGetAllAdminParams;
   setQueryParams?: (params: IGetAllAdminParams) => void;

   selectedFilters: Array<IAdministrationFilter>;
   selectedSorters: Array<IAdministrationSorter>;
   setFilterStateAction?: ActionCreatorWithPayload<any, string>;

   setSorterStateAction?: ActionCreatorWithPayload<any, string>;

   location: string;
   withSearchParams?: boolean;
   legendProps?: Array<{color: string; message:string}>;

   excelMutation?: IExcelProps;
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
        legendProps,
        excelMutation,
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

    const renderActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            {renderActionButtons
                ? renderActionButtons()
                : (
                    <Tooltip title="Action not allowed">
                        <Box>
                            <IconButton disabled>
                                {' '}
                                <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="disabled" />
                            </IconButton>
                        </Box>
                    </Tooltip>
                )}
            <ExportExcel mutation={excelMutation} disabled={!excelMutation} queryParams={queryParams} />
        </div>
    );
    const renderGridSettings = () => {
        const sortingColumns = mapGridColumnsToAdministrationSortingProps(filterableGridColumnDef);
        const filtersColumns = mapGridColumnsToAdministrationFilterProps(filterableGridColumnDef);

        return (
            <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
                { renderActions() }
                {showFiltersAndSorters && (
                <div style={{ ...flexCenterObjectStyles, width: '100%', gap: '20px' }}>
                    <AdministrationFilters searchParams={searchParams} setSearchParams={setSearchParams} withSearchParams={withSearchParams} setStateAction={setFilterStateAction} selectedFilters={selectedFilters} columns={filtersColumns} location={location} />
                    <AdministrationSorting searchParams={searchParams} setSearchParams={setSearchParams} withSearchParams={withSearchParams} setStateAction={setSorterStateAction} selectedSorters={selectedSorters} columns={sortingColumns} location={location} />
                </div>
                )}
                {legendProps
                    ? <LegendBox renders={legendProps} />
                    : <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }} />}
            </div>
        );
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        if (setQueryParams) {
            setQueryParams({ ...queryParams, page: model.page + 1, itemsPerPage: model.pageSize });
        }
    };
    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div>
                {modals.map((m, i) => m.showModal && m.modal(i))}
                { renderGridSettings() }
                { error
                    ? <div className={styles.errorText}>Error loading data</div>
                    : (
                        <DataGrid
                          columns={[ ...filterableGridColumnDef, ...notFilterableGridColumnDef ]}
                          rows={data?.items ?? []}
                          rowCount={data?.totalItemsCount ?? 0}
                          paginationMode="server"
                          autoHeight
                          onPaginationModelChange={handlePaginationModelChange}
                          pageSizeOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                          disableRowSelectionOnClick
                          getRowClassName={(params) => getRowClassName(params.row.isDeleted, params.row.isVisible)}
                          initialState={{
                              columns: {
                                  columnVisibilityModel: {
                                      isDeleted: false,
                                      isVisible: false,
                                  },
                              },
                              pagination: {
                                  paginationModel: {
                                      page: 0,
                                      pageSize: DEFAULT_ITEMS_PER_PAGE,
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
