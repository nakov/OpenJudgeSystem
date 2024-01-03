import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { SortingEnum } from '../../../common/enums';

import styles from './AdministrationSorting.module.scss';

interface IAdministrationSortProps {
    columns: string[];
    updateCb: (updateDate: any) => void;
}

const orderByOptions = [
    { name: 'Ascending', value: SortingEnum.ASC },
    { name: 'Descending', value: SortingEnum.DESC },
];

const AdministrationSorting = (props: IAdministrationSortProps) => {
    const { columns, updateCb } = props;
    const [ selectedSortColumn, setSelectedSortColumn ] = useState<string>('');
    const [ selectedOrderBy, setSelectedOrderBy ] = useState<SortingEnum>(SortingEnum.ASC);

    const updateSortByColumn = ({ target }: SelectChangeEvent<string>) => {
        const { value } = target;
        setSelectedSortColumn(value);

        updateCb({ orderBy: selectedOrderBy, sortBy: value.replace(' ', '') });
    };

    const updateOrderByColumn = ({ target }: SelectChangeEvent<SortingEnum>) => {
        const { value } = target;
        const enumValue = value === 'ASC'
            ? SortingEnum.ASC
            : SortingEnum.DESC;

        setSelectedOrderBy(enumValue);
        updateCb({ orderBy: enumValue, sortBy: selectedSortColumn.replace(' ', '') });
    };

    const onClearIconClick = () => {
        setSelectedSortColumn('');
        setSelectedOrderBy(SortingEnum.ASC);
    };

    return (
        <div className={styles.sortWrapper}>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-sorting-label">Sort by</InputLabel>
                <Select
                  labelId="column-sorting-label"
                  value={selectedSortColumn}
                  label="Sort By"
                  onChange={(e) => updateSortByColumn(e)}
                >
                    { columns.map((sortOption) => (
                        <MenuItem key={`a-s-e-${sortOption}`} value={sortOption}>{sortOption}</MenuItem>)) }
                </Select>
            </FormControl>
            <FormControl sx={{ width: '140px', marginRight: '10px' }} variant="standard">
                <InputLabel id="column-order-label">Order By</InputLabel>
                <Select
                  labelId="column-order-label"
                  value={selectedOrderBy}
                  label="Order By"
                  onChange={(e) => updateOrderByColumn(e)}
                  disabled={!selectedSortColumn}
                >
                    { orderByOptions.map((orderByOption) => (
                        <MenuItem key={`s-o-o-${orderByOption.name}`} value={orderByOption.value}>{orderByOption.name}</MenuItem>)) }
                </Select>
            </FormControl>
            <ClearIcon className={styles.clearIcon} onClick={onClearIconClick} />
        </div>
    );
};

export default AdministrationSorting;
