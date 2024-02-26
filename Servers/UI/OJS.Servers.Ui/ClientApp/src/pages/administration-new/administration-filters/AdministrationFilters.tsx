import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetURLSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close';
// eslint-disable-next-line import/no-extraneous-dependencies
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';

import { FilterColumnTypeEnum } from '../../../common/enums';
import { IFilterColumn } from '../../../common/types';

import styles from './AdministrationFilters.module.scss';

interface IFiltersColumnOperators {
    name: string;
    value: string;
}

interface IAdministrationFilterProps {
    columns: IFilterColumn[];
    location: string;
    searchParams?: URLSearchParams;
    setSearchParams?: SetURLSearchParams;
    selectedFilters: Array<IAdministrationFilter>;
    setStateAction: ActionCreatorWithPayload<unknown, string>;
    withSearchParams?: boolean;
}

interface IAdministrationFilter {
    column: string;
    operator: string;
    value: string;
    inputType: FilterColumnTypeEnum;
    availableOperators?: IFiltersColumnOperators[];
    availableColumns: IFilterColumn[];
}

interface IDefaultFilter {
    column: string;
    operator: string;
    value: string;
    availableOperators: IFiltersColumnOperators[];
    availableColumns: IFilterColumn[];
    inputType: FilterColumnTypeEnum;
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
        { name: 'Not Equals', value: 'notequals' },
    ],
    [FilterColumnTypeEnum.DATE]: [
        { name: 'Equals', value: 'equals' },
        { name: 'Greater Than', value: 'greaterthan' },
        { name: 'Less Than', value: 'lessthan' },
        { name: 'Less Than Or Equal', value: 'lessthanorequal' },
        { name: 'Greater Than Or Equal', value: 'greaterthanorequal' },
        { name: 'Not Equals', value: 'notequals' },
    ],
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
    const { columns, withSearchParams = true, location, selectedFilters, setStateAction, searchParams, setSearchParams } = props;
    const dispatch = useDispatch();
    const defaultFilter = useMemo<IDefaultFilter>(() => ({
        column: '',
        operator: '',
        value: '',
        availableOperators: [],
        availableColumns: columns,
        inputType: FilterColumnTypeEnum.STRING,
    }), [ columns ]);

    useEffect(() => {
        if (selectedFilters.length <= 0) {
            dispatch(setStateAction({ key: location, filters: [ defaultFilter ] }));
        }
    }, [ defaultFilter, dispatch, location, selectedFilters.length, setStateAction ]);

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);

    const open = Boolean(anchor);

    const mapUrlToFilters = (): IAdministrationFilter[] => {
        if (!setSearchParams || !searchParams) {
            return [];
        }
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
            const availableColumns = columns.filter((c) => !urlSelectedFilters.some((f) => f.column === c.columnName) &&
                !selectedFilters.some((sl) => sl.column === c.columnName));
            const availableOperators = column?.columnType
                ? DROPDOWN_OPERATORS[column.columnType]
                : [];

            const filter: IAdministrationFilter = {
                column: column?.columnName || '',
                operator,
                value,
                availableOperators,
                availableColumns: [ ...availableColumns, { ...column } ],
                inputType: column?.columnType || FilterColumnTypeEnum.STRING,
            };

            urlSelectedFilters.push(filter);
        });

        return urlSelectedFilters;
    };

    useEffect(() => {
        const urlSelectedFilters = mapUrlToFilters();
        if (urlSelectedFilters.length) {
            dispatch(setStateAction({ key: location, filters: urlSelectedFilters }));
        }
    }, []);

    useEffect(() => {
        if (!searchParams || !setSearchParams) {
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
            if (withSearchParams) {
                setSearchParams(searchParams);
            }

            return;
        }

        const delayedSetOfSearch = debounce(() => {
            searchParams.set('filter', filtersFormattedArray.join('&'));
            if (withSearchParams) {
                setSearchParams(searchParams);
            }
        }, 300);

        delayedSetOfSearch();

        // eslint-disable-next-line consistent-return
        return () => {
            delayedSetOfSearch.cancel();
        };
    }, [ selectedFilters ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addFilter = () => {
        const availableColumns = columns.filter((column) => !selectedFilters.some((f) => f.column === column.columnName));
        const newFiltersArray = [ { ...defaultFilter, availableColumns }, ...selectedFilters.map((filter) => ({
            ...filter,
            availableColumns: [ ...availableColumns, { columnName: filter.column, columnType: filter.inputType } ],
        })) ];
        dispatch(setStateAction({ key: location, filters: newFiltersArray }));
    };

    const removeAllFilters = () => {
        if (searchParams && setSearchParams && withSearchParams) {
            searchParams.delete('filter');
            setSearchParams(searchParams);
        }
        dispatch(setStateAction({
            key: location,
            filters: [ defaultFilter ],
        }));
    };

    const removeSingleFilter = (idx: number) => {
        const deletedFilter = selectedFilters[idx];
        const newFiltersArray = [ ...selectedFilters.map((filter) => ({
            ...filter,
            availableColumns: [ ...filter.availableColumns, { columnName: deletedFilter.column, columnType: deletedFilter.inputType } ],
        })) ];
        newFiltersArray.splice(idx, 1);
        dispatch(setStateAction({ key: location, filters: newFiltersArray }));
        if (newFiltersArray.length === 1 && searchParams && setSearchParams) {
            searchParams.delete('filter');
            if (withSearchParams) {
                setSearchParams(searchParams);
            }
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

        dispatch(setStateAction({ key: location, filters: newFiltersArray }));
    };

    const renderInputField = (idx: number) => {
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
                      disabled={!selectedFilters[idx].operator || idx > 0}
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
              disabled={!selectedFilters[idx].operator || idx > 0}
            />
        );
    };

    const renderFilter = (idx: number) => (
        <div style={{ display: 'flex', margin: '5px 0' }} key={`admin-filter-${idx}`}>
            <CloseIcon className={styles.closeIcon} onClick={() => setAnchor(null)} />
            { idx !== 0 && (
                <DeleteIcon color="error" className={styles.removeFilterButton} onClick={() => removeSingleFilter(idx)} />
            )}
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-select-label">Column</InputLabel>
                <Select
                  labelId="column-select-label"
                  value={selectedFilters[idx]?.column}
                  label="Column"
                  onChange={(e) => updateFilterColumnData(idx, e, 'column')}
                  disabled={idx > 0}
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
                  disabled={!selectedFilters[idx].column || idx > 0}
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
