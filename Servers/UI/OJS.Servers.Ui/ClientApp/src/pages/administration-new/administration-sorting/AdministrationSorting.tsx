import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SetURLSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';

import { SortingEnum } from '../../../common/enums';

import styles from './AdministrationSorting.module.scss';

interface IAdministrationSortProps {
    columns: string[];
    selectedSorters: Array<IAdministrationSorter>;
    setStateAction?: Dispatch<SetStateAction<IAdministrationSorter[]>>;
    withSearchParams?: boolean;
    searchParams?: URLSearchParams;
    setSearchParams?: SetURLSearchParams;

    isFiltersOpened: boolean;
    setOpenedSorters: Dispatch<SetStateAction<string | null>>;
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
    const {
        columns,
        selectedSorters,
        setStateAction,
        searchParams,
        setSearchParams,
        withSearchParams = true,
        isFiltersOpened,
        setOpenedSorters,
    } = props;
    const defaultSorter = {
        columnName: '',
        orderBy: SortingEnum.ASC,
        availableColumns: columns,
    };

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (selectedSorters.length <= 0 && setStateAction) {
            setStateAction([ defaultSorter ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const open = Boolean(anchor);

    const mapUrlToSorters = (): IAdministrationSorter[] => {
        if (!searchParams || !setSearchParams) {
            return [];
        }
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
            const availableColumns = columns.filter((column) => !urlSelectedSorters.some((s) => s.columnName === column) &&
                !selectedSorters.some((ss) => ss.columnName === column));

            const sorter: IAdministrationSorter = {
                columnName,
                orderBy,
                availableColumns: [ ...availableColumns, columnName ],
            };

            urlSelectedSorters.push(sorter);
        });

        return urlSelectedSorters;
    };

    useEffect(() => {
        const urlSelectedSorters = mapUrlToSorters();
        if (urlSelectedSorters.length && setStateAction) {
            setStateAction(urlSelectedSorters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isFiltersOpened) {
            setAnchor(null);
        }
    }, [ isFiltersOpened ]);

    useEffect(() => {
        const formatSorterToString = (sorter: IAdministrationSorter) => {
            if (!sorter?.columnName) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return `${sorter.columnName.replace(/\s/g, '').toLowerCase()}=${sorter.orderBy}`;
        };

        const sorterFormattedArray = selectedSorters.map(formatSorterToString).filter((sorter) => sorter);
        if (!sorterFormattedArray.length && searchParams && setSearchParams) {
            searchParams.delete('sorting');
            if (withSearchParams) {
                setSearchParams(searchParams);
            }
            return;
        }

        const delayedSetOfSearch = debounce(() => {
            if (searchParams && setSearchParams && withSearchParams) {
                searchParams.set('sorting', sorterFormattedArray.join('&'));
                setSearchParams(searchParams);
            }
        }, 500);

        delayedSetOfSearch();

        // eslint-disable-next-line consistent-return
        return () => {
            delayedSetOfSearch.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ selectedSorters ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!anchor) {
            setOpenedSorters('sorters');
        }

        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addSorter = () => {
        const availableColumns = columns.filter((column) => !selectedSorters.some((s) => s.columnName === column));
        const newSortersArray = [ { ...defaultSorter, availableColumns }, ...selectedSorters.map((sorter) => ({
            ...sorter,
            availableColumns: [ ...availableColumns, sorter.columnName ],
        })) ];

        if (setStateAction) {
            setStateAction(newSortersArray);
        }
    };

    const removeAllSorters = () => {
        if (searchParams && setSearchParams && withSearchParams) {
            searchParams.delete('sorting');
            setSearchParams(searchParams);
        }

        if (setStateAction) {
            setStateAction([ defaultSorter ]);
        }
    };

    const removeSingleSorter = (idx: number) => {
        const deletedSorter = selectedSorters[idx];
        const newSortersArray = [ ...selectedSorters.map((sorter) => ({
            ...sorter,
            availableColumns: [ ...sorter.availableColumns, deletedSorter.columnName ],
        })) ];
        newSortersArray.splice(idx, 1);

        if (setStateAction) {
            setStateAction(newSortersArray);
        }

        if (newSortersArray.length === 1) {
            if (searchParams && setSearchParams && withSearchParams) {
                searchParams.delete('sorting');
                setSearchParams(searchParams);
            }
        }
    };

    const updateSorterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;

        const newSortersArray = [ ...selectedSorters ].map((element, idx) => {
            if (idx === indexToUpdate) {
                return { ...element, [updateProperty]: value };
            }
            return element;
        });

        if (setStateAction) {
            setStateAction(newSortersArray);
        }
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
                  disabled={idx > 0}
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
                  disabled={!selectedSorters[idx]?.columnName || idx > 0}
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

const mapUrlToSorters = (searchParams: URLSearchParams | undefined, columns:Array<string>): IAdministrationSorter[] => {
    if (!searchParams) {
        return [];
    }
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
            availableColumns: [ ...availableColumns, columnName ],
        };

        urlSelectedSorters.push(sorter);
    });

    return urlSelectedSorters;
};

export {
    type IAdministrationSorter,
    mapGridColumnsToAdministrationSortingProps,
    mapSorterParamsToQueryString,
    mapUrlToSorters,
};

export default AdministrationSorting;
