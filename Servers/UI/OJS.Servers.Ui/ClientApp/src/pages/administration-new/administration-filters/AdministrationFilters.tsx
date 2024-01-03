import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import debounce from 'lodash/debounce';

import { FilterColumnTypeEnum } from '../../../common/enums';
import { IFilterColumn } from '../../../common/types';

import styles from './administrationFilters.module.scss';

interface IFiltersColumnOperators {
    name: string;
    value: string;
}

interface IAdministrationFilters {
    columns: IFilterColumn[];
}

interface IAdministrationFilter {
    column: string;
    operator: string;
    value: string;
    availableOperators?: IFiltersColumnOperators[];
}

const STRING_OPERATORS = [
    { name: 'Contains', value: 'contains' },
    { name: 'Equals', value: 'equals' },
    { name: 'Starts with', value: 'startswith' },
    { name: 'Ends with', value: 'endswith' },
];
const BOOL_OPERATORS = [
    { name: 'Equals', value: 'equals' },
];
const INT_OPERATORS = [
    { name: 'Equals', value: 'equals' },
    { name: 'Greater Than', value: 'greatherthan' },
    { name: 'Less Than', value: 'lessthan' },
    { name: 'Less Than Or Equal', value: 'lessthanorequal' },
    { name: 'Greater Than Or Equal', value: 'greatherthanorequal' },
    { name: 'Equals Not Equals', value: 'equalsnotequals' },
];
const DATE_OPERATORS = [
    { name: 'Test', value: 'test' },
]; // TBD

const AdministrationFilters = (props: IAdministrationFilters) => {
    const { columns } = props;
    const [ , setSearchParams ] = useSearchParams();

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);
    const [ filters, setFilters ] =
        useState<Array<IAdministrationFilter>>([ { column: '', operator: '', value: '', availableOperators: [] } ]);

    const open = Boolean(anchor);

    useEffect(() => {
        const formatFilterToString = (filter: IAdministrationFilter) => {
            if (!filter.column || !filter.operator || !filter.value) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return `${filter.column} ${filter.operator} ${filter.value}`;
        };

        const filtersFormattedString = filters.map(formatFilterToString);
        const resultString = `filter=${filtersFormattedString.join(',')}`;

        const delayedSetOfSearch = debounce(() => {
            setSearchParams(resultString);
        }, 500);

        delayedSetOfSearch();

        return () => {
            delayedSetOfSearch.cancel();
        };
    }, [ filters, setSearchParams ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addFilter = () => {
        const newFiltersArray = [ ...filters ];
        newFiltersArray.push({ column: '', operator: '', value: '', availableOperators: [] });
        setFilters(newFiltersArray);
    };

    const removeAllFilters = () => {
        setFilters([ { column: '', operator: '', value: '', availableOperators: [] } ]);
        setSearchParams('');
    };

    const removeSingleFilter = (idx: number) => {
        const newFiltersArray = [ ...filters ];
        newFiltersArray.splice(idx, 1);
        setFilters(newFiltersArray);
    };

    const getFilterOperatorsByType = (columnType: FilterColumnTypeEnum) => {
        let operators;
        if (columnType === FilterColumnTypeEnum.STRING) {
            operators = STRING_OPERATORS;
        } else if (columnType === FilterColumnTypeEnum.INT) {
            operators = INT_OPERATORS;
        } else if (columnType === FilterColumnTypeEnum.BOOL) {
            operators = BOOL_OPERATORS;
        } else if (columnType === FilterColumnTypeEnum.DATE) {
            operators = DATE_OPERATORS;
        }

        return operators;
    };

    const getColumnTypeByName = (columnName: string) => columns.find((column) => column.columnName === columnName)?.columnType;

    const getValueFieldInputType = (idx: number) => {
        // eslint-disable-next-line prefer-destructuring
        const { column } = filters[idx];
        const filterColumnType = getColumnTypeByName(column);

        if (filterColumnType === FilterColumnTypeEnum.INT) {
            return 'number';
        }

        return 'text';
    };

    const updateFilterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;
        const newFiltersArray = [ ...filters ].map((element, idx) => {
            if (idx === indexToUpdate) {
                if (updateProperty === 'column') {
                    const columnType = getColumnTypeByName(value);
                    const columnOperators = columnType
                        ? getFilterOperatorsByType(columnType)
                        : [];
                    return { column: value, operator: '', value: '', availableOperators: columnOperators };
                }
                return { ...element, [updateProperty]: value };
            }
            return element;
        });

        setFilters(newFiltersArray);
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
                  value={filters[idx]?.column}
                  label="Column"
                  onChange={(e) => updateFilterColumnData(idx, e, 'column')}
                >
                    { columns.map((column) => (
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
                  value={filters[idx]?.operator}
                  label="Operator"
                  onChange={(e) => updateFilterColumnData(idx, e, 'operator')}
                  disabled={!filters[idx].column}
                >
                    { filters[idx].availableOperators?.map((operator) => (
                        <MenuItem key={`s-o-${operator.value}`} value={operator.value}>{operator.name}</MenuItem>)) }
                </Select>
            </FormControl>
            <TextField
              label="Value"
              variant="standard"
              value={filters[idx]?.value}
              multiline
              type={getValueFieldInputType(idx)}
              onChange={(e) => updateFilterColumnData(idx, e, 'value')}
              disabled={!filters[idx].operator}
            />
        </div>
    );

    return (
        <div>
            <Button onClick={handleOpenClick} style={{ margin: '20px 0' }}>
                { open
                    ? 'close'
                    : 'open' }
                {' '}
                filters
            </Button>
            <BasePopup anchor={anchor} open={open}>
                <div className={styles.administrationFilters}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        { filters.map((filter, idx) => renderFilter(idx))}
                    </div>
                    <div className={styles.buttonsSection}>
                        <Button onClick={addFilter}>Add filter</Button>
                        <Button onClick={removeAllFilters}>Remove All</Button>
                    </div>
                </div>
            </BasePopup>
        </div>
    );
};

export default AdministrationFilters;
