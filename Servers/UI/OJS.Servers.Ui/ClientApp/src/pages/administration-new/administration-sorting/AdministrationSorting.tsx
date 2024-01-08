import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import debounce from 'lodash/debounce';

import { SortingEnum } from '../../../common/enums';

import styles from './AdministrationSorting.module.scss';

interface IAdministrationSortProps {
    columns: string[];
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
    const { columns } = props;
    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ anchor, setAnchor ] = useState<null | HTMLElement>(null);
    const [ sorters, setSorters ] =
        useState<Array<IAdministrationSorter>>([ {
            columnName: '',
            orderBy: SortingEnum.ASC,
            availableColumns: columns,
        } ]);

    const open = Boolean(anchor);

    useEffect(() => {
        const sorterParams = searchParams.get('sorting')?.split('&') ?? [];
        sorterParams.filter((s) => s).forEach((sorter: string) => {
            const sorterColumn = sorter.split('=')[0];
            const sorterOrderBy = sorter.split('=')[1];

            const columnName = columns.find((c) => c.toLowerCase() === sorterColumn) || '';
            const orderBy = sorterOrderBy === 'ASC'
                ? SortingEnum.ASC
                : SortingEnum.DESC;
            const availableColumns = columns.filter((column) => !sorters.some((s) => s.columnName === column));

            const newSortersArray = [ ...sorters, {
                columnName,
                orderBy,
                availableColumns,
            } ];
            setSorters(newSortersArray);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const formatSorterToString = (sorter: IAdministrationSorter) => {
            if (!sorter.columnName) {
                return;
            }

            // eslint-disable-next-line consistent-return
            return `${sorter.columnName.replace(' ', '').toLowerCase()}=${sorter.orderBy}`;
        };

        const sorterFormattedArray = sorters.filter((sorter) => sorter.columnName).map(formatSorterToString);

        if (!sorterFormattedArray.length) {
            return;
        }
        const resultString = `${sorterFormattedArray.join('&')}`;

        const delayedSetOfSearch = debounce(() => {
            searchParams.set('sorting', resultString);
            setSearchParams(searchParams);
        }, 500);

        delayedSetOfSearch();

        // eslint-disable-next-line consistent-return
        return () => {
            delayedSetOfSearch.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ sorters ]);

    const handleOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor
            ? null
            : event.currentTarget);
    };

    const addSorter = () => {
        const availableColumns = columns.filter((column) => !sorters.some((s) => s.columnName === column));
        const newSortersArray = [ {
            columnName: '',
            availableColumns,
            orderBy: SortingEnum.ASC,
        }, ...sorters ];
        setSorters(newSortersArray);
    };

    const removeAllSorters = () => {
        setSorters([ {
            columnName: '',
            orderBy: SortingEnum.ASC,
            availableColumns: columns,
        } ]);
        searchParams.delete('sorting');
        setSearchParams(searchParams);
    };

    const removeSingleSorter = (idx: number) => {
        const newSortersArray = [ ...sorters ];
        newSortersArray.splice(idx, 1);
        setSorters(newSortersArray);
    };

    const updateSorterColumnData = (indexToUpdate: number, { target }: any, updateProperty: string) => {
        const { value } = target;

        const newSortersArray = [ ...sorters ].map((element, idx) => {
            if (idx === indexToUpdate) {
                return { ...element, [updateProperty]: value };
            }
            return element;
        });

        setSorters(newSortersArray);
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
                  value={sorters[idx]?.columnName}
                  label="Sort By"
                  onChange={(e) => updateSorterColumnData(idx, e, 'columnName')}
                >
                    { sorters[idx].availableColumns.map((sortOption) => (
                        <MenuItem key={`a-s-e-${sortOption}`} value={sortOption}>{sortOption}</MenuItem>)) }
                </Select>
            </FormControl>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-order-label">Order By</InputLabel>
                <Select
                  labelId="column-order-label"
                  value={sorters[idx]?.orderBy}
                  label="Order By"
                  onChange={(e) => updateSorterColumnData(idx, e, 'orderBy')}
                  disabled={!sorters[idx]?.columnName}
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
            </Button>
            <BasePopup anchor={anchor} open={open}>
                <div className={styles.administrationSorters}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        { sorters.map((sorter, idx) => renderSorter(idx))}
                    </div>
                    <div className={styles.buttonsSection}>
                        <Button onClick={addSorter} disabled={!sorters[sorters.length - 1].columnName}>Add Sorter</Button>
                        <Button onClick={removeAllSorters}>Remove All</Button>
                    </div>
                </div>
            </BasePopup>
        </div>
    );
};

export default AdministrationSorting;
