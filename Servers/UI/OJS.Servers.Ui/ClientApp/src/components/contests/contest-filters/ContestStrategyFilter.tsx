import React, { useCallback, useMemo, useState } from 'react';

import { FilterType, IFilter } from '../../../common/contest-types';
import { useContests } from '../../../hooks/use-contests';
import concatClassNames from '../../../utils/class-names';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import ExpandButton from '../../guidelines/buttons/ExpandButton';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { Orientation } from '../../guidelines/lists/List';

import styles from './ContestFilter.module.scss';

interface IContestStrategyFilterProps {
    values: IFilter[];
    type: FilterType;
    onSelect: (filterId: number) => void;
    maxDisplayCount: number;
}

const ContestStrategyFilter = ({
    values,
    type,
    onSelect,
    maxDisplayCount,
}: IContestStrategyFilterProps) => {
    const initialExpanded = false;
    const [ expanded, setExpanded ] = useState(initialExpanded);

    const { state: { filters } } = useContests();

    const listOrientation = useMemo(
        () => type === FilterType.Status
            ? Orientation.horizontal
            : Orientation.vertical,
        [ type ],
    );

    const filtersToDisplay = useMemo(
        () => expanded
            ? values
            : values.slice(0, maxDisplayCount),
        [ expanded, values, maxDisplayCount ],
    );

    const toggleFiltersExpanded = useCallback(
        (isExpanded: boolean) => {
            setExpanded(isExpanded);
        },
        [],
    );

    const renderExpandButton = useCallback(
        (allFilters: IFilter[]) => allFilters.length > maxDisplayCount
            ? <ExpandButton onExpandChanged={toggleFiltersExpanded} />
            : null,
        [ toggleFiltersExpanded, maxDisplayCount ],
    );

    const renderStrategyFilterItem = useCallback(
        (buttonType: ButtonType, btnClassName: string, name: string, id: number) => (
            <div className={styles.strategyHeader}>
                <div className={styles.tooltip}>
                    <span className={styles.tooltipElement}>{name}</span>
                </div>
                <Button
                  type={buttonType}
                  onClick={() => onSelect(id)}
                  className={styles.strategyElementClassName}
                  text={name}
                  size={ButtonSize.small}
                />
            </div>
        ),
        [ onSelect ],
    );

    const getRenderFilterItemFunc = useCallback(
        (filterType: FilterType) => ({ id, name }: IFilter) => {
            const selectedStatusFilter = filters.find((f) => f.id === id);
            const selectedButtonType = selectedStatusFilter
                ? ButtonType.primary
                : ButtonType.secondary;

            const btnClassName = filterType === FilterType.Status
                ? styles.btnSelectFilter
                : '';

            return renderStrategyFilterItem(selectedButtonType, btnClassName, name, id);
        },
        [ filters, renderStrategyFilterItem ],
    );

    const className = concatClassNames(
        styles.listFilters,
        expanded
            ? styles.expanded
            : '',
    );

    return (
        <div className={styles.filterTypeContainer}>
            <Heading
              type={HeadingType.small}
              className={styles.heading}
            >
                {type}
            </Heading>
            <List
              values={filtersToDisplay}
              itemFunc={getRenderFilterItemFunc(type)}
              orientation={listOrientation}
              className={className}
              itemClassName={styles.listFilterItem}
              fullWidth
            />
            {renderExpandButton(values)}
        </div>
    );
};

export default ContestStrategyFilter;
