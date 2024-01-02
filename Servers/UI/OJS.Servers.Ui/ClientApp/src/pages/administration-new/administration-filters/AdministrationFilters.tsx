import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import debounce from 'lodash/debounce';

import styles from './AdministrationFilters.module.scss';

interface IAdministrationFilters {
    columns: string[];
}

interface IAdministrationFilter {
    column: string;
    operator: string;
    value: string;
}

const OPERATORS = [ 'Contains', 'Equals', 'Starts with', 'Ends with', 'Is empty', 'Is not empty' ];

const AdministrationFilters = (props: IAdministrationFilters) => {
    const { columns } = props;
    const [ , setSearchParams ] = useSearchParams();

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);
    const [ filters, setFilters ] =
        useState<Array<IAdministrationFilter>>([ { column: '', operator: '', value: '' } ]);

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
        newFiltersArray.push({ column: '', operator: '', value: '' });
        setFilters(newFiltersArray);
    };

    const removeAllFilters = () => {
        setFilters([ { column: '', operator: '', value: '' } ]);
        setSearchParams('');
    };

    const removeSingleFilter = (idx: number) => {
        const newFiltersArray = [ ...filters ];
        newFiltersArray.splice(idx, 1);

        setFilters(newFiltersArray);
    };

    const updateFilterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;
        const newFiltersArray = [ ...filters ].map((element, idx) => {
            if (idx === indexToUpdate) {
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
                    { columns.map((column) => (<MenuItem key={`s-c-${column}`} value={column}>{column}</MenuItem>)) }
                </Select>
            </FormControl>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-operator-label">Operator</InputLabel>
                <Select
                  labelId="column-operator-label"
                  value={filters[idx]?.operator}
                  label="Operator"
                  onChange={(e) => updateFilterColumnData(idx, e, 'operator')}
                >
                    { OPERATORS.map((operator) => (<MenuItem key={`s-o-${operator}`} value={operator}>{operator}</MenuItem>)) }
                </Select>
            </FormControl>
            <TextField
              label="Value"
              variant="standard"
              value={filters[idx]?.value}
              multiline
              type="text"
              onChange={(e) => updateFilterColumnData(idx, e, 'value')}
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
