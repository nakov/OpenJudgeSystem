import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { MenuItem, Select } from '@mui/material';

import { IContestStrategyFilter, IFilter } from '../../../common/contest-types';
import useTheme from '../../../hooks/use-theme';
import { setContestStrategy } from '../../../redux/features/contestsSlice';
import { useGetContestStrategiesQuery } from '../../../redux/services/contestsService';

interface IContestStrategyProps {
    filteredStrategies: IFilter[];
}

const ContestStrategies = ({ filteredStrategies }: IContestStrategyProps) => {
    const dispatch = useDispatch();
    const { themeColors } = useTheme();

    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery();

    const menuItems: ReactNode[] = React.useMemo(() => {
        if (!contestStrategies) { return []; }

        const displayStrategies = filteredStrategies.length === 0
            ? contestStrategies
            : filteredStrategies;
        const handleStrategySelect = (strategy: any) => {
            dispatch(setContestStrategy(strategy));
        };

        return displayStrategies.map((item: IContestStrategyFilter) => (
            <MenuItem
              key={`contest-strategy-item-${item.id}`}
              value={item.id}
              onClick={() => handleStrategySelect(item)}
            >
                {item.name}
            </MenuItem>
        ));
    }, [ contestStrategies, filteredStrategies ]);

    if (strategiesError) { return <div>Error loading strategies...</div>; }

    if (areStrategiesLoading) { return <div>Loading strategies...</div>; }

    return (
        <div style={{ width: '95%' }}>
            <Select
              sx={{
                  width: '100%',
                  height: 40,
                  color: themeColors.textColor,
                  fontSize: 16,
                  fontWeight: 500,
                  '& .MuiSvgIcon-root': { fill: themeColors.textColor },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#44a9f8', borderWidth: 2 },
              }}
              defaultValue=""
              labelId="strategy-label"
              autoWidth
              displayEmpty
              children={[ <MenuItem key="strategy-item-default" value="" selected>Select strategy</MenuItem>, ...menuItems ]}
            />
        </div>
    );
};

export default ContestStrategies;
