import { NavigateOptions, URLSearchParamsInit } from 'react-router-dom';
import { IDropdownItem } from 'src/common/types';

import { IContestStrategyFilter } from '../../../common/contest-types';
import { useGetContestStrategiesQuery } from '../../../redux/services/contestsService';
import { useAppSelector } from '../../../redux/store';
import Dropdown from '../../guidelines/dropdown/Dropdown';

import styles from './ContestStrategies.module.scss';

interface IContestStrategiesProps {
    setSearchParams: (newParams: URLSearchParamsInit, navigateOpts?: NavigateOptions) => void;
    searchParams: URLSearchParams;
    setSelectedStrategy: (item: IContestStrategyFilter | null) => void;
    selectedStrategy: IContestStrategyFilter | null;
}

const ContestStrategies = ({ setSearchParams, searchParams, setSelectedStrategy, selectedStrategy }: IContestStrategiesProps) => {
    const { selectedCategory } = useAppSelector((state) => state.contests);

    const {
        data: contestStrategies,
        isLoading: areStrategiesLoading,
        error: strategiesError,
    } = useGetContestStrategiesQuery({ contestCategoryId: selectedCategory?.id ?? 0 });

    const handleStrategySelect = (item: IDropdownItem | undefined) => {
        if (item) {
            const strategy = contestStrategies?.find((s) => s.id === item.id);
            if (strategy) {
                setSelectedStrategy(strategy);
                searchParams.set('page', '1');
                setSearchParams(searchParams);
            }
        } else {
            setSelectedStrategy(null);
        }
    };

    const handleStrategyClear = () => {
        setSelectedStrategy(null);
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
              handleDropdownItemClear={handleStrategyClear}
              isSearchable
            />
        </div>
    );
};

export default ContestStrategies;
