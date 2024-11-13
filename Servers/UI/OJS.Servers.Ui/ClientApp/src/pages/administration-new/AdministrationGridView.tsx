import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Box, IconButton, Slide, Tooltip } from '@mui/material';
import { DataGrid, GridFilterModel, GridLogicOperator, GridPaginationModel } from '@mui/x-data-grid';
import { GridFilterItem } from '@mui/x-data-grid/models/gridFilterItem';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ACTION_NOT_ALLOWED_MESSAGE, NOT_LOGGED_IN_MESSAGE } from '../../common/messages';
import { AdjacencyList, ExceptionData, IGetAllAdminParams, IPagedResultType } from '../../common/types';
import ExportExcel from '../../components/administration/common/export-excel/ExportExcel';
import LegendBox from '../../components/administration/common/legend-box/LegendBox';
import { AdministrationGridColDef } from '../../components/administration/utils/mui-utils';
import { isDeletedClassName, isVisibleClassName } from '../../hooks/use-administration-theme-provider';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ROWS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import AdministrationFilters, {
    addDefaultFilter,
    IAdministrationFilter,
    IAdministrationSorter,
    mapGridColumnsToAdministrationFilterProps,
    mapGridColumnsToAdministrationSortingProps,
    mapUrlToSorters,
} from './administration-filters/AdministrationFilters';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './AdministrationStyles.module.scss';

interface IAdministrationGridViewProps<T> {
    filterableGridColumnDef: Array<AdministrationGridColDef>;
    notFilterableGridColumnDef: Array<AdministrationGridColDef>;
    data: IPagedResultType<T> | undefined;
    showFiltersAndSorters?: boolean;
    renderActionButtons?: () => ReactNode;
    modals?: Array<{ showModal: boolean; modal: (index: number) => ReactNode }>;
    error: ExceptionData[] | FetchBaseQueryError | SerializedError | undefined;
    queryParams?: IGetAllAdminParams;
    setQueryParams?: Dispatch<SetStateAction<IGetAllAdminParams>>;
    withSearchParams?: boolean;
    legendProps?: Array<{ color: string; message: string }>;
    specificRowIdName?: string[] | null;
    excelMutation?: any;
    defaultFilter?: string;
    defaultSorter?: string;
}

interface IVisibleColumns {
    [key: string]: boolean;
}

// Both collections should use the column's field property as keys.
const defaultVisibleColumns: AdjacencyList<string, boolean> = { submissionId: true };

const defaultNotVisibleColumns: AdjacencyList<string, boolean> = {
    isDeleted: false,
    isVisible: false,
    createdOn: false,
    modifiedOn: false,
    deletedOn: false,
    processingComment: false,
    startedExecutionOn: false,
    completedExecutionOn: false,
    fileExtension: false,
    contestPassword: false,
    limitBetweenSubmissions: false,
    allowParallelSubmissionsInTasks: false,
};

const defaultFilterToAdd = 'isdeleted~equals~false';
const defaultSorterToAdd = 'id=DESC';

const AdministrationGridView = <T extends object>(props: IAdministrationGridViewProps<T>) => {
    const idColumnPattern = /\b(id|(?:\S+\s+id))\b/i;
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
        withSearchParams = true,
        legendProps,
        excelMutation,
        specificRowIdName: specifyColumnIdName,
        defaultFilter = defaultFilterToAdd,
        defaultSorter = defaultSorterToAdd,
    } = props;

    const [ searchParams, setSearchParams ] = useSearchParams();

    // eslint-disable-next-line max-len
    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(addDefaultFilter(filterableGridColumnDef, searchParams, defaultFilter));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(filterableGridColumnDef),
        defaultSorter,
    ));

    const getRowClassName = (isDeleted: boolean, isVisible: boolean) => {
        if (isDeleted) {
            return isDeletedClassName;
        }

        // Do not simplify.
        if (isVisible === false) {
            return isVisibleClassName;
        }

        return '';
    };

    const renderActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            {renderActionButtons
                ? renderActionButtons()
                : (
                    <Tooltip title={ACTION_NOT_ALLOWED_MESSAGE}>
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
                {renderActions()}
                {showFiltersAndSorters && (
                    <div style={{ ...flexCenterObjectStyles, width: '100%', gap: '20px' }}>
                        <AdministrationFilters
                          searchParams={searchParams}
                          setSearchParams={setSearchParams}
                          withSearchParams={withSearchParams}
                          setSelectedFilters={setSelectedFilters}
                          setQueryParams={setQueryParams}
                          selectedFilters={selectedFilters}
                          filterColumns={filtersColumns}
                          sortingColumns={sortingColumns}
                          selectedSorters={selectedSorters}
                          setSelectedSorters={setSelectedSorters}
                        />
                    </div>
                )}
                <LegendBox renders={legendProps ?? []} />
            </div>
        );
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        if (setQueryParams) {
            setQueryParams({ ...queryParams, page: model.page + 1, itemsPerPage: model.pageSize });
        }
    };

    const notVisibleIdColumns: IVisibleColumns = filterableGridColumnDef.reduce((acc, column) => {
        const headerName = column.headerName ?? '';
        const isHidden = column.hidden ?? false;

        if (isHidden || idColumnPattern.test(headerName)) {
            acc[column.field] = false;
        }

        return acc;
    }, {} as IVisibleColumns);

    const initialState = {
        columns: {
            columnVisibilityModel: {
                ...notVisibleIdColumns,
                ...defaultNotVisibleColumns,
                ...defaultVisibleColumns,
            },
        },
        pagination: {
            paginationModel: {
                page: 0,
                pageSize: DEFAULT_ITEMS_PER_PAGE,
            },
        },
    };

    // const [ filterModel, setFilterModel ] = useState<GridFilterModel>({
    //     items: [
    //         { id: '1', field: 'name', operator: 'contains', value: 'Test' } as GridFilterItem,
    //         { id: '2', field: 'id', operator: '>', value: '30' } as GridFilterItem,
    //     ] as GridFilterItem[],
    // });

    const [ filterModel, setFilterModel ] = useState<GridFilterModel>({
        items: [],
        logicOperator: GridLogicOperator.And,
        quickFilterValues: [],
        quickFilterLogicOperator: GridLogicOperator.And,
    });

    // const handleFilterModelChange = useCallback(
    //     (newFilterModel: GridFilterModel) => {
    //         setFilterModel((prevFilterModel) => {
    //             // Create a copy of previous filter items
    //             const updatedItems = [ ...prevFilterModel.items ];
    //
    //             // Loop through new filter items
    //             newFilterModel.items.forEach((newItem) => {
    //                 // Check if a filter for the same column already exists
    //                 const existingIndex = updatedItems.findIndex((item) => item.field === newItem.field);
    //
    //                 if (existingIndex >= 0) {
    //                     // Update the existing filter item
    //                     updatedItems[existingIndex] = newItem;
    //                 } else {
    //                     // Add the new filter item if it doesn't already exist
    //                     updatedItems.push(newItem);
    //                 }
    //             });
    //
    //             // Return the updated filter model with merged items
    //             return {
    //                 ...prevFilterModel,
    //                 items: updatedItems,
    //             };
    //         });
    //     },
    //     [],
    // );

    const handleFilterModelChange = useCallback(
        (newFilterModel: GridFilterModel) => {
            setFilterModel((prevFilterModel) => {
                const updatedItems = [ ...prevFilterModel.items ];
                let hasChanges = false;

                newFilterModel.items.forEach((newItem) => {
                    const existingIndex = updatedItems.findIndex((item) => item.field === newItem.field);

                    if (existingIndex >= 0) {
                        if (
                            updatedItems[existingIndex].value !== newItem.value
                        ) {
                            updatedItems[existingIndex] = newItem;
                            hasChanges = true;
                        }
                    } else {
                        updatedItems.push(newItem);
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    return {
                        ...prevFilterModel,
                        items: updatedItems,
                    };
                }

                return prevFilterModel;
            });
        },
        [ setFilterModel ],
    );

    useEffect(() => {
        console.log(filterModel);
    }, [ filterModel ]);

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div>
                {modals.map((m, i) => m.showModal
                    ? (
                        <div key={i}>
                            {m.modal(i)}
                        </div>
                    )
                    : null)}
                {renderGridSettings()}
                {error
                    ? (
                        <div className={styles.errorText}>
                            Error loading data.
                            {Array.isArray(error) && error[0]?.name === NOT_LOGGED_IN_MESSAGE
                                ? `${error[0]?.message}`
                                : ''}
                        </div>
                    )
                    : (
                        <DataGrid
                          columns={[ ...filterableGridColumnDef, ...notFilterableGridColumnDef ]}
                          rows={data?.items ?? []}
                          rowCount={data?.totalItemsCount ?? 0}
                          paginationMode="server"
                          filterMode="server"
                          filterModel={filterModel}
                          onFilterModelChange={handleFilterModelChange}
                          autoHeight
                          onPaginationModelChange={handlePaginationModelChange}
                          pageSizeOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                          disableRowSelectionOnClick
                          getRowId={(row) => specifyColumnIdName && specifyColumnIdName.length > 0
                              ? specifyColumnIdName.map((colName) => row[colName]).join('')
                              : row.id}
                          getRowClassName={(params) => getRowClassName(params.row.isDeleted, params.row.isVisible)}
                          initialState={initialState}
                        />
                    )}
            </div>
        </Slide>
    );
};

export { defaultFilterToAdd, defaultSorterToAdd };

export default AdministrationGridView;
