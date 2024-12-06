import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IDropdownItem } from 'src/common/types';

import { IContestStrategyFilter } from '../../../common/contest-types';
import { setContestStrategy } from '../../../redux/features/contestsSlice';
import { useGetContestStrategiesQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Dropdown from '../../guidelines/dropdown/Dropdown';

import styles from './ContestStrategies.module.scss';

const ContestStrategies = () => {
    const dispatch = useAppDispatch();
    const [ searchParams ] = useSearchParams();
    const { selectedStrategy, selectedCategory } = useAppSelector((state) => state.contests);

    const selectedId = useMemo(() => searchParams.get('strategy'), [ searchParams ]);
    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery({ contestCategoryId: selectedCategory?.id ?? 0 });

    useEffect(() => {
        if (selectedId && contestStrategies) {
            const selected = contestStrategies.find((s) => s.id.toString() === selectedId);

            if (selected) {
                dispatch(setContestStrategy(selected));
            } else {
                dispatch(setContestStrategy(null));
            }
        }
    }, [ selectedId, contestStrategies, dispatch ]);

    const handleStrategySelect = (item: IDropdownItem | undefined) => {
        if (item) {
            const strategy = contestStrategies?.find((s) => s.id === item.id);
            if (strategy) {
                dispatch(setContestStrategy(strategy));
            }
        } else {
            dispatch(setContestStrategy(null));
        }
    };

    if (strategiesError) {
        return <div>Error loading strategies...</div>;
    }

    if (areStrategiesLoading) {
        return <div>Loading strategies...</div>;
    }

    return (
        <div className={styles.selectWrapper}>
            <Dropdown<IContestStrategyFilter>
              dropdownItems={contestStrategies || []}
              value={selectedStrategy ?? { id: 0, name: '' }}
              placeholder="Select strategy"
              noOptionsFoundText="No strategies found"
              handleDropdownItemClick={handleStrategySelect}
              isSearchable
            />
        </div>
    );
};

export default ContestStrategies;
