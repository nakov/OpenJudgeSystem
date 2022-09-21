import React, { useCallback, useMemo, useState } from 'react';

import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { Orientation } from '../../guidelines/lists/List';
import { FilterType, IFilter } from '../../../common/contest-types';
import ExpandButton from '../../guidelines/buttons/ExpandButton';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import concatClassNames from '../../../utils/class-names';

import styles from './ContestFilter.module.scss';


interface IContestFilterTypeProps {
    values: IFilter[];
    type: FilterType;
    orientation?: Orientation;
    onFilterClick: (filterId: number) => void;
}

const ContestFilter = ({
    values,
    type,
    orientation,
    onFilterClick,
}: IContestFilterTypeProps) => {
    const [ expanded, setExpanded ] = useState(false);
    const maxFiltersToDisplayCount = 3;
    
    const className = concatClassNames(
        styles.listFilters,
        expanded
            ? styles.expanded
            : '',
    );
    
    const filtersToDisplayCount = useMemo(
        () => expanded
            ? values.length
            : maxFiltersToDisplayCount,
        [ expanded, values ],
    );
    
    const toggleFiltersExpanded = useCallback(
        (isExpanded) => {
            setExpanded(isExpanded);
        },
        [],
    );

    const renderExpandButton = useCallback(
        (allFilters: IFilter[]) => allFilters.length > maxFiltersToDisplayCount
            ? <ExpandButton onExpandChanged={toggleFiltersExpanded}/>
            : null,
        [ toggleFiltersExpanded ],
    );

    const getRenderFilterItemFunc = useCallback(
        (filterType: FilterType) => ({ id, name }: IFilter) => {
            // TODO: investigate why filters change ids
            //  and use id instead of name for checking if filter is selected
            const filterIsSelected = values.some((f) => f.name === name);
            const buttonType = filterIsSelected
                ? ButtonType.primary
                : ButtonType.secondary;

            const btnClassName = filterType === FilterType.Status
                ? styles.btnSelectFilter
                : '';

            return (
                <Button
                    type={buttonType}
                    onClick={() => onFilterClick(id)}
                    className={btnClassName}
                    text={name}
                    size={ButtonSize.small}
                />
            );
        },
        [ onFilterClick, values ],
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
                values={values}
                itemFunc={getRenderFilterItemFunc(type)}
                orientation={orientation}
                className={className}
                itemClassName={styles.listFilterItem}
                fullWidth
                itemsCount={filtersToDisplayCount}
            />
            {renderExpandButton(values)}
        </div>
    );
};

export default ContestFilter;


