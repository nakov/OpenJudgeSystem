import { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import { IAllowedStrategyType } from 'src/common/types';
import { useGetSubmissionTypesForCategoryQuery } from 'src/redux/services/submissionTypesService';

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
    const [ selectValue, setSelectValue ] = useState<string>('');
    const [ strategiesForSelectedCategory, setStrategiesForSelectedCategory ] = useState<IAllowedStrategyType[]>([]);

    const { data: strategiesForCategory } = useGetSubmissionTypesForCategoryQuery({ contestCategoryId: selectedCategory?.id ?? 0 });

    const selectedId = useMemo(() => searchParams.get('strategy'), [ searchParams ]);
    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery();

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

    useEffect(() => {
        if (selectedStrategy) {
            setSelectValue(selectedStrategy.id.toString());
        } else {
            setSelectValue('');
        }
    }, [ selectedStrategy ]);

    useEffect(() => {
        if (strategiesForCategory && strategiesForCategory.length > 0) {
            setStrategiesForSelectedCategory(strategiesForCategory);
        }
    }, [ strategiesForCategory, setStrategiesForSelectedCategory ]);

    const mapDataToDropdownItem = (el: IContestStrategyFilter) => ({
        id: el.id,
        name: el.name,
    });

    const dropdownItems = useMemo(
        () => !selectedCategory || strategiesForSelectedCategory.length === 0
            ? (contestStrategies || []).map(mapDataToDropdownItem)
            : strategiesForSelectedCategory.map(mapDataToDropdownItem),
        [ contestStrategies, selectedCategory, strategiesForSelectedCategory ],
    );

    const removeSelectedStrategy = () => {
        dispatch(setContestStrategy(null));
    };

    const handleStrategySelect = (s: IContestStrategyFilter) => {
        dispatch(setContestStrategy(s));
        setSelectValue(s.id.toString());
    };

    if (strategiesError) {
        return <div>Error loading strategies...</div>;
    }

    if (areStrategiesLoading) {
        return <div>Loading strategies...</div>;
    }

    return (
        <div className={styles.selectWrapper}>
            {selectedStrategy && <IoMdClose onClick={removeSelectedStrategy} />}
            <Dropdown
              dropdownItems={dropdownItems || []}
              value={selectValue}
              placeholder="Select strategy"
              handleDropdownItemClick={handleStrategySelect}
            />
        </div>
    );
};

export default ContestStrategies;
