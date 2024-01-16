import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';

import { SortingEnum } from '../../../common/enums';
import { IRootStore } from '../../../common/types';
import { setAdminContestsSorters } from '../../../redux/features/admin/contestsAdminSlice';
import { mapFilterParamsToQueryString } from '../administration-filters/AdministrationFilters';

import styles from './AdministrationSorting.module.scss';

interface IAdministrationSortProps {
    columns: string[];
    location: string;
    shouldUpdateUrl?: boolean;
}

interface IAdministrationSorter {
    columnName: string;
    orderBy: SortingEnum;
    availableColumns: string[];
}

const orderByOptions = [
    { name: 'Ascending', value: SortingEnum.ASC },
    { name: 'Descending', value: SortingEnum.DESC },
];

const AdministrationSorting = (props: IAdministrationSortProps) => {
    const { columns, shouldUpdateUrl = true, location } = props;
    const defaultSorter = {
        columnName: '',
        orderBy: SortingEnum.ASC,
        availableColumns: columns,
    };
    const dispatch = useDispatch();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const selectedSorters =
        useSelector((state: IRootStore) => state.adminContests[location]?.selectedSorters) ?? [ defaultSorter ];
    const selectedFilters =
        useSelector((state: IRootStore) => state.adminContests[location]?.selectedFilters);

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);

    const open = Boolean(anchor);

    const mapUrlToSorters = (): IAdministrationSorter[] => {
        const urlSelectedSorters: IAdministrationSorter[] = [];

        const sorterParams = searchParams.get('sorting') ?? '';
        const urlParams = sorterParams.split('&').filter((param) => param);
        urlParams.forEach((param: string) => {
            const paramChunks = param.split('=').filter((chunk) => chunk);

            const sorterColumn = paramChunks[0];
            const sorterOrderBy = paramChunks[1];

            const columnName = columns.find((c) => c.toLowerCase() === sorterColumn) || '';
            const orderBy = sorterOrderBy === 'ASC'
                ? SortingEnum.ASC
                : SortingEnum.DESC;
            const availableColumns = columns.filter((column) => !urlSelectedSorters.some((s) => s.columnName === column));

            const sorter: IAdministrationSorter = {
                columnName,
                orderBy,
                availableColumns,
            };

            urlSelectedSorters.push(sorter);
        });

        return urlSelectedSorters;
    };

    useEffect(() => {
        if (!shouldUpdateUrl) {
            return;
        }

        const urlSelectedSorters = mapUrlToSorters();
        if (urlSelectedSorters.length) {
            dispatch(setAdminContestsSorters({ key: location, sorters: urlSelectedSorters }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!shouldUpdateUrl) {
            return;
        }
        const formatSorterToString = (sorter: IAdministrationSorter) => {
            if (!sorter?.columnName) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return `${sorter.columnName.replace(/\s/g, '').toLowerCase()}=${sorter.orderBy}`;
        };

        const sorterFormattedArray = selectedSorters.map(formatSorterToString).filter((sorter) => sorter);
        if (!sorterFormattedArray.length) {
            searchParams.delete('sorting');
            setSearchParams(searchParams);
            return;
        }
        const filtersUrl = mapFilterParamsToQueryString(selectedFilters || []);
        const resultString = `sorting=${sorterFormattedArray.join('&')}${filtersUrl
            ? `&filter=${filtersUrl}`
            : ''}`;

        const delayedSetOfSearch = debounce(() => {
            setSearchParams(resultString);
        }, 500);

        delayedSetOfSearch();

        // eslint-disable-next-line consistent-return
        return () => {
            delayedSetOfSearch.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ selectedSorters ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addSorter = () => {
        const availableColumns = columns.filter((column) => !selectedSorters.some((s) => s.columnName === column));
        const newSortersArray = [ { ...defaultSorter, availableColumns }, ...selectedSorters ];
        dispatch(setAdminContestsSorters({ key: location, sorters: newSortersArray }));
    };

    const removeAllSorters = () => {
        searchParams.delete('sorting');
        setSearchParams(searchParams);
        dispatch(setAdminContestsSorters({ key: location, sorters: [ defaultSorter ] }));
    };

    const removeSingleSorter = (idx: number) => {
        const newSortersArray = [ ...selectedSorters ];
        newSortersArray.splice(idx, 1);
        dispatch(setAdminContestsSorters({ key: location, sorters: newSortersArray }));
    };

    const updateSorterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;

        const newSortersArray = [ ...selectedSorters ].map((element, idx) => {
            if (idx === indexToUpdate) {
                return { ...element, [updateProperty]: value };
            }
            return element;
        });

        dispatch(setAdminContestsSorters({ key: location, sorters: newSortersArray }));
    };

    const renderSorter = (idx: number) => (
        <div className={styles.sortWrapper} key={`a-s-w-${idx}`}>
            <CloseIcon className={styles.closeIcon} onClick={() => setAnchor(null)} />
            { idx !== 0 && (
                <DeleteIcon className={styles.removeSorterButton} onClick={() => removeSingleSorter(idx)} />
            )}
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-sorting-label">Sort by</InputLabel>
                <Select
                  labelId="column-sorting-label"
                  value={selectedSorters[idx]?.columnName}
                  label="Sort By"
                  onChange={(e) => updateSorterColumnData(idx, e, 'columnName')}
                >
                    { selectedSorters[idx].availableColumns.map((sortOption) => (
                        <MenuItem key={`a-s-e-${sortOption}`} value={sortOption}>{sortOption}</MenuItem>)) }
                </Select>
            </FormControl>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-order-label">Order By</InputLabel>
                <Select
                  labelId="column-order-label"
                  value={selectedSorters[idx]?.orderBy}
                  label="Order By"
                  onChange={(e) => updateSorterColumnData(idx, e, 'orderBy')}
                  disabled={!selectedSorters[idx]?.columnName}
                >
                    { orderByOptions.map((orderByOption) => (
                        <MenuItem key={`s-o-o-${orderByOption.name}`} value={orderByOption.value}>{orderByOption.name}</MenuItem>)) }
                </Select>
            </FormControl>
        </div>
    );

    return (
        <div>
            <Button onClick={handleOpenClick}>
                { open
                    ? 'close'
                    : 'open' }
                {' '}
                sorters
                <span style={{ marginLeft: '10px', color: 'black' }}>
                    (
                    {selectedSorters.filter((s) => s.columnName).length}
                    ) Active
                </span>
            </Button>
            <BasePopup anchor={anchor} open={open}>
                <div className={styles.administrationSorters}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        { selectedSorters.map((sorter, idx) => renderSorter(idx))}
                    </div>
                    <div className={styles.buttonsSection}>
                        <Button
                          onClick={addSorter}
                          disabled={selectedSorters.length
                              ? !selectedSorters[0].columnName
                              : true}
                        >
                            Add Sorter
                        </Button>
                        <Button onClick={removeAllSorters}>Remove All</Button>
                    </div>
                </div>
            </BasePopup>
        </div>
    );
};

const mapSorterParamsToQueryString = (selectedSorters: IAdministrationSorter[]) => {
    const queryString: string[] = [];
    selectedSorters.forEach((sorter: IAdministrationSorter) => {
        if (!sorter.columnName) {
            return;
        }
        queryString.push(`${sorter.columnName.replace(/\s/g, '').toLowerCase()}=${sorter.orderBy}`);
    });
    return queryString.filter((el) => el).join('&') ?? '';
};

const mapGridColumnsToAdministrationSortingProps =
    (dataColumns: GridColDef[]): string[] => dataColumns.map((column) => column.headerName?.replace(/\s/g, '') ?? '').filter((el) => el);

export {
    type IAdministrationSorter,
    mapGridColumnsToAdministrationSortingProps,
    mapSorterParamsToQueryString,
};

export default AdministrationSorting;
