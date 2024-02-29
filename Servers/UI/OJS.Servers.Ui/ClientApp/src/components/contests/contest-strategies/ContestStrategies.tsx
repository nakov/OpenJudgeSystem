import React, { ReactNode, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MenuItem, Select } from '@mui/material';

import { IContestStrategyFilter } from '../../../common/contest-types';
import useTheme from '../../../hooks/use-theme';
import { setContestStrategy } from '../../../redux/features/contestsSlice';
import { useGetContestStrategiesQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

import styles from './ContestStrategies.module.scss';

const ContestStrategies = () => {
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();
    const { selectedStrategy, selectedCategory } = useAppSelector((state) => state.contests);
    const [ selectValue, setSelectValue ] = useState('');

    const textColorClassName = getColorClassName(themeColors.textColor);

    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery();

    useEffect(() => {
        if (!selectedStrategy) {
            setSelectValue('');
        }
    }, [ selectedStrategy ]);

    const removeSelectedStrategy = () => {
        dispatch(setContestStrategy(null));
    };

    const menuItems: ReactNode[] = React.useMemo(() => {
        if (!contestStrategies) { return []; }

        const displayStrategies = !selectedCategory || selectedCategory?.allowedStrategyTypes?.length === 0
            ? contestStrategies
            : selectedCategory?.allowedStrategyTypes;

        const handleStrategySelect = (s: any) => {
            dispatch(setContestStrategy(s));
            setSelectValue(s.id);
        };

        return (displayStrategies || []).map((item: IContestStrategyFilter) => (
            <MenuItem
              key={`contest-strategy-item-${item.id}`}
              value={item.id}
              onClick={() => handleStrategySelect(item)}
            >
                {item.name}
            </MenuItem>
        ));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [ contestStrategies, selectedCategory?.allowedStrategyTypes ]);

    if (strategiesError) { return <div>Error loading strategies...</div>; }

    if (areStrategiesLoading) { return <div>Loading strategies...</div>; }

    return (
        <div className={styles.selectWrapper}>
            <IoMdClose onClick={removeSelectedStrategy} />
            <Select
              className={`${styles.contestStrategiesSelect} ${textColorClassName}`}
              sx={{
                  '& .MuiSvgIcon-root': { fill: themeColors.textColor },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#44a9f8', borderWidth: 2 },
              }}
              value={selectValue}
              defaultValue=""
              labelId="strategy-label"
              autoWidth
              displayEmpty
            >
                <MenuItem key="strategy-default-item" value="" selected>Select strategy</MenuItem>
                {[ ...menuItems ]}
            </Select>
        </div>
    );
};

export default ContestStrategies;
