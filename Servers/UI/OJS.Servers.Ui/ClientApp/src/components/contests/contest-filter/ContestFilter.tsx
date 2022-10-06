import React, { useCallback, useMemo, useState } from 'react';

import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { Orientation } from '../../guidelines/lists/List';
import { FilterType, IFilter } from '../../../common/contest-types';
import ExpandButton from '../../guidelines/buttons/ExpandButton';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import concatClassNames from '../../../utils/class-names';

import styles from './ContestFilter.module.scss';


interface IContestFilterProps {
    values: IFilter[];
    type: FilterType;
    onSelect: (filterId: number) => void;
    maxDisplayCount: number;
}

const ContestFilter = ({
    values,
    type,
    onSelect,
    maxDisplayCount,
}: IContestFilterProps) => {
    const initialExpanded = false;
    const [ expanded, setExpanded ] = useState(initialExpanded);

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
            ? <ExpandButton onExpandChanged={toggleFiltersExpanded}/>
            : null,
        [ toggleFiltersExpanded, maxDisplayCount ],
    );

    const renderStatusFilterItem = useCallback(
        (buttonType: ButtonType, btnClassName: string,name: string, id: number) => (
            <Button
                type={buttonType}
                onClick={() => onSelect(id)}
                className={btnClassName}
                text={name}
                size={ButtonSize.small}
            />
        ),
        [ onSelect ],
    );

    const renderStrategyFilterItem = useCallback(
        (buttonType: ButtonType, btnClassName: string, name: string, id: number)=> (
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
            const filterIsSelected = values.some((f) => f.name === name);
            const buttonType = filterIsSelected
                ? ButtonType.primary
                : ButtonType.secondary;

            const btnClassName = filterType === FilterType.Status
                ? styles.btnSelectFilter
                : '';

            return type === FilterType.Strategy
                ? renderStrategyFilterItem(buttonType,btnClassName,name,id)
                : renderStatusFilterItem(buttonType,btnClassName, name, id);
            
        },
        [ renderStatusFilterItem, renderStrategyFilterItem, type, values ],
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

export default ContestFilter;


