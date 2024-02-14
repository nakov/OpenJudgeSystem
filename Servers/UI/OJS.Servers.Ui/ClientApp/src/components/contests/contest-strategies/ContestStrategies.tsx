/* eslint-disable react-hooks/exhaustive-deps */

import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, Select } from '@mui/material';

import { IContestStrategyFilter } from '../../../common/contest-types';
import useTheme from '../../../hooks/use-theme';
import { setContestStrategy } from '../../../redux/features/contestsSlice';
import { useGetContestStrategiesQuery } from '../../../redux/services/contestsService';

const ContestStrategies = () => {
    const dispatch = useDispatch();
    const { themeColors } = useTheme();
    const { category, strategy } = useSelector((state: any) => state.contests);

    const [ selectValue, setSelectValue ] = useState('');

    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery();

    useEffect(() => {
        if (!strategy) {
            setSelectValue('');
        }
    }, [ strategy ]);

    const menuItems: ReactNode[] = React.useMemo(() => {
        if (!contestStrategies) { return []; }

        const displayStrategies = category?.allowedStrategyTypes?.length === 0
            ? contestStrategies
            : category?.allowedStrategyTypes;

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
    }, [ contestStrategies, category?.allowedStrategyTypes ]);

    if (strategiesError) { return <div>Error loading strategies...</div>; }

    if (areStrategiesLoading) { return <div>Loading strategies...</div>; }

    return (
        <Select
          sx={{
              width: 350,
              height: 40,
              color: themeColors.textColor,
              fontSize: 16,
              fontWeight: 500,
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
    );
};

export default ContestStrategies;
