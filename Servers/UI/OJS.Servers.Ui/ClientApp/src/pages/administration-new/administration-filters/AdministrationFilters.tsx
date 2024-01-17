import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';

import { FilterColumnTypeEnum } from '../../../common/enums';
import { IFilterColumn, IRootStore } from '../../../common/types';
import { setAdminContestsFilters } from '../../../redux/features/admin/contestsAdminSlice';

import styles from './AdministrationFilters.module.scss';

interface IFiltersColumnOperators {
    name: string;
    value: string;
}

interface IAdministrationFilterProps {
    columns: IFilterColumn[];
    location: string;
    shouldUpdateUrl?: boolean;
}

interface IAdministrationFilter {
    column: string;
    operator: string;
    value: string;
    inputType: FilterColumnTypeEnum;
    availableOperators?: IFiltersColumnOperators[];
    availableColumns: IFilterColumn[];
}

const DROPDOWN_OPERATORS = {
    [FilterColumnTypeEnum.STRING]: [
        { name: 'Contains', value: 'contains' },
        { name: 'Equals', value: 'equals' },
        { name: 'Starts with', value: 'startswith' },
        { name: 'Ends with', value: 'endswith' },
    ],
    [FilterColumnTypeEnum.BOOL]: [
        { name: 'Equals', value: 'equals' },
    ],
    [FilterColumnTypeEnum.NUMBER]: [
        { name: 'Equals', value: 'equals' },
        { name: 'Greater Than', value: 'greaterthan' },
        { name: 'Less Than', value: 'lessthan' },
        { name: 'Less Than Or Equal', value: 'lessthanorequal' },
        { name: 'Greater Than Or Equal', value: 'greaterthanorequal' },
        { name: 'Equals Not Equals', value: 'equalsnotequals' },
    ],
    [FilterColumnTypeEnum.DATE]: [
        { name: 'Test', value: 'test' },
    ], // TBD
};

const BOOL_DROPDOWN_VALUES = [
    { name: 'True', value: 'true' },
    { name: 'False', value: 'false' },
    { name: 'Null', value: '' },
];

const mapStringToFilterColumnTypeEnum = (type: string) => {
    if (type === 'number') {
        return FilterColumnTypeEnum.NUMBER;
    } if (type === 'boolean') {
        return FilterColumnTypeEnum.BOOL;
    } if (type === 'date') {
        return FilterColumnTypeEnum.DATE;
    }
    return FilterColumnTypeEnum.STRING;
};

const AdministrationFilters = (props: IAdministrationFilterProps) => {
    const { columns, shouldUpdateUrl = true, location } = props;
    const defaultFilter = {
        column: '',
        operator: '',
        value: '',
        availableOperators: [],
        availableColumns: columns,
        inputType: FilterColumnTypeEnum.STRING,
    };
    const dispatch = useDispatch();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const selectedFilters = useSelector((state: IRootStore) => state.adminContests[location]?.selectedFilters) ?? [ defaultFilter ];

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);

    const open = Boolean(anchor);

    const mapUrlToFilters = (): IAdministrationFilter[] => {
        const urlSelectedFilters: IAdministrationFilter[] = [];

        const filterParams = searchParams.get('filter') ?? '';
        const urlParams = filterParams.split('&').filter((param) => param);
        urlParams.forEach((param: string) => {
            const paramChunks = param.split('~').filter((chunk) => chunk);

            const columnValue = paramChunks[0];
            const operator = paramChunks[1];
            const value = paramChunks[2];

            const column = columns.find((c) => c.columnName.toLowerCase() === columnValue) ||
                { columnName: '', columnType: FilterColumnTypeEnum.STRING };
            const availableColumns = columns.filter((c) => !urlSelectedFilters.some((f) => f.column === c.columnName));
            const availableOperators = column?.columnType
                ? DROPDOWN_OPERATORS[column.columnType]
                : [];

            const filter: IAdministrationFilter = {
                column: column?.columnName || '',
                operator,
                value,
                availableOperators,
                availableColumns,
                inputType: column?.columnType || FilterColumnTypeEnum.STRING,
            };

            urlSelectedFilters.push(filter);
        });

        return urlSelectedFilters;
    };

    useEffect(() => {
        if (!shouldUpdateUrl) {
            return;
        }

        const urlSelectedFilters = mapUrlToFilters();
        if (urlSelectedFilters.length) {
            dispatch(setAdminContestsFilters({ key: location, filters: urlSelectedFilters }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!shouldUpdateUrl) {
            return;
        }

        const formatFilterToString = (filter: IAdministrationFilter) => {
            if (!filter.column || !filter.operator || !filter.value) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return `${filter.column.toLowerCase()}~${filter.operator.toLowerCase()}~${filter.value.toLowerCase()}`;
        };

        const filtersFormattedArray = selectedFilters.map(formatFilterToString).filter((filter) => filter);
        if (!filtersFormattedArray.length) {
            searchParams.delete('filter');
            setSearchParams(searchParams);
            return;
        }

        const delayedSetOfSearch = debounce(() => {
            searchParams.set('filter', filtersFormattedArray.join('&'));
            setSearchParams(searchParams);
        }, 300);

        delayedSetOfSearch();

        // eslint-disable-next-line consistent-return
        return () => {
            delayedSetOfSearch.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ selectedFilters ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addFilter = () => {
        const availableColumns = columns.filter((column) => !selectedFilters.some((f) => f.column === column.columnName));
        const newFiltersArray = [ { ...defaultFilter, availableColumns }, ...selectedFilters ];
        dispatch(setAdminContestsFilters({ key: location, filters: newFiltersArray }));
    };

    const removeAllFilters = () => {
        searchParams.delete('filter');
        setSearchParams(searchParams);
        dispatch(setAdminContestsFilters({
            key: location,
            filters: [ defaultFilter ],
        }));
    };

    const removeSingleFilter = (idx: number) => {
        // eslint-disable-next-line prefer-destructuring
        const deletedFilter = selectedFilters[idx];
        const newFiltersArray = [ ...selectedFilters ];
        const availableColumnsCopy = [ ...newFiltersArray[0].availableColumns ];
        const filtersColumn : IFilterColumn = { columnName: deletedFilter.column, columnType: deletedFilter.inputType };
        availableColumnsCopy.unshift(filtersColumn);
        newFiltersArray[0] = { ...newFiltersArray[0], availableColumns: availableColumnsCopy };
        newFiltersArray.splice(idx, 1);
        dispatch(setAdminContestsFilters({ key: location, filters: newFiltersArray }));
        if (newFiltersArray.length === 1) {
            searchParams.delete('filter');
            setSearchParams(searchParams);
        }
    };

    const getColumnTypeByName = (columnName: string) => columns.find((column) => column.columnName === columnName)?.columnType;

    const updateFilterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;

        const newFiltersArray = [ ...selectedFilters ].map((element, idx) => {
            if (idx === indexToUpdate) {
                if (updateProperty === 'column') {
                    const columnType = getColumnTypeByName(value);
                    const columnOperators = columnType
                        ? DROPDOWN_OPERATORS[columnType]
                        : [];
                    return {
                        column: value,
                        operator: '',
                        value: '',
                        inputType: columnType || FilterColumnTypeEnum.STRING,
                        availableOperators: columnOperators,
                        availableColumns: element.availableColumns,
                    };
                }
                return { ...element, [updateProperty]: value };
            }
            return element;
        });

        dispatch(setAdminContestsFilters({ key: location, filters: newFiltersArray }));
    };

    const renderInputField = (idx: number) => {
        // eslint-disable-next-line prefer-destructuring
        const { inputType } = selectedFilters[idx];
        if (inputType === FilterColumnTypeEnum.BOOL) {
            return (
                <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                    <InputLabel id="value-select-label" shrink>Value</InputLabel>
                    <Select
                      labelId="value-select-label"
                      value={selectedFilters[idx]?.value}
                      label="Value"
                      onChange={(e) => updateFilterColumnData(idx, e, 'value')}
                      disabled={!selectedFilters[idx].operator}
                    >
                        { BOOL_DROPDOWN_VALUES.map((column) => (
                            <MenuItem
                              key={`s-c-${column.value}`}
                              value={column.value}
                            >
                                {column.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        return (
            <TextField
              label={inputType === FilterColumnTypeEnum.DATE
                  ? ' '
                  : 'Value'}
              variant="standard"
              type={inputType}
              value={selectedFilters[idx]?.value}
              onChange={(e) => updateFilterColumnData(idx, e, 'value')}
              disabled={!selectedFilters[idx].operator}
            />
        );
    };

    const renderFilter = (idx: number) => (
        <div style={{ display: 'flex', margin: '5px 0' }} key={`admin-filter-${idx}`}>
            <CloseIcon className={styles.closeIcon} onClick={() => setAnchor(null)} />
            { idx !== 0 && (
                <DeleteIcon className={styles.removeFilterButton} onClick={() => removeSingleFilter(idx)} />
            )}
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-select-label">Column</InputLabel>
                <Select
                  labelId="column-select-label"
                  value={selectedFilters[idx]?.column}
                  label="Column"
                  onChange={(e) => updateFilterColumnData(idx, e, 'column')}
                >
                    { selectedFilters[idx]?.availableColumns?.map((column) => (
                        <MenuItem
                          key={`s-c-${column.columnName}`}
                          value={column.columnName}
                        >
                            {column.columnName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-operator-label">Operator</InputLabel>
                <Select
                  labelId="column-operator-label"
                  value={selectedFilters[idx]?.operator}
                  label="Operator"
                  onChange={(e) => updateFilterColumnData(idx, e, 'operator')}
                  disabled={!selectedFilters[idx].column}
                >
                    { selectedFilters[idx].availableOperators?.map((operator) => (
                        <MenuItem key={`s-o-${operator.value}`} value={operator.value}>{operator.name}</MenuItem>)) }
                </Select>
            </FormControl>
            {renderInputField(idx)}
        </div>
    );

    return (
        <div>
            <Button onClick={handleOpenClick} style={{ margin: '10px 0' }}>
                { open
                    ? 'close'
                    : 'open' }
                {' '}
                filters
                <span style={{ marginLeft: '10px', color: 'black' }}>
                    (
                    {selectedFilters.filter((f) => f.value).length}
                    ) Active
                </span>
            </Button>
            <BasePopup anchor={anchor} open={open}>
                <div className={styles.administrationFilters}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        { selectedFilters.map((filter, idx) => renderFilter(idx))}
                    </div>
                    <div className={styles.buttonsSection}>
                        <Button
                          onClick={addFilter}
                          disabled={selectedFilters.length
                              ? !selectedFilters[0].value
                              : false}
                        >
                            Add filter
                        </Button>
                        <Button onClick={removeAllFilters}>Remove All</Button>
                    </div>
                </div>
            </BasePopup>
        </div>
    );
};

const mapFilterParamsToQueryString = (selectedFilters: IAdministrationFilter[]) => {
    const queryString: string[] = [];
    selectedFilters.forEach((filter: IAdministrationFilter) => {
        if (!filter.column || !filter.operator || !filter.value) {
            return;
        }
        queryString.push(`${filter.column.toLowerCase()}~${filter.operator.toLowerCase()}~${filter.value.toLowerCase()}`);
    });
    return queryString.filter((el) => el).join('&') ?? '';
};

const mapGridColumnsToAdministrationFilterProps = (dataColumns: GridColDef[]): IFilterColumn[] => dataColumns.map((column) => {
    const mappedEnumType = mapStringToFilterColumnTypeEnum(column.type || '');
    return { columnName: column.headerName?.replace(/\s/g, '') ?? '', columnType: mappedEnumType };
});

export {
    type IAdministrationFilter,
    type IFiltersColumnOperators,
    mapGridColumnsToAdministrationFilterProps,
    mapFilterParamsToQueryString,
};

export default AdministrationFilters;
