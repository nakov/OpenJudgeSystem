import React, { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';
import { useContests } from '../../../hooks/use-contests';
import { ISort } from '../../../common/contest-types';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import List, { Orientation } from '../../guidelines/lists/List';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { splitByCapitalLetter } from '../../../utils/string-utils';
import { DEFAULT_SORT_FILTER_TYPE, DEFAULT_SORT_TYPE } from '../../../common/constants';

import styles from './ContestSorting.module.scss';

interface IContestSortingProps {
    onSortClick: (sorting: ISort) => void;
}

const ContestSorting = ({ onSortClick }: IContestSortingProps) => {
    const {
        state: { possibleSortingTypes }, 
        actions: { clearFilters }, 
    } = useContests();
    
    const handleOnSortClick = useCallback(
        (sortId: number) => {
            const sorting = possibleSortingTypes.find(({ id }) => sortId === id);

            if (isNil(sorting)) {
                return;
            }

            onSortClick(sorting);
        },
        [ possibleSortingTypes, onSortClick ],
    );

    const getRenderSortingItemFunc = useCallback(
        (value : ISort) => {
            const { id, name } = value;
            const sortingIsSelected = possibleSortingTypes.some((s) => s.name === name);
            const buttonType = sortingIsSelected
                ? ButtonType.primary
                : ButtonType.secondary;
            
            return (
                <Button
                type={buttonType}
                onClick={() => handleOnSortClick(id)}
                className={styles.btnSelectFilter}
                text={splitByCapitalLetter(name)}
                size={ButtonSize.small}
            />
            );
        },
        [ handleOnSortClick, possibleSortingTypes ],
    );
    
    const defaultSortingId = useMemo(
        () =>
            possibleSortingTypes.filter(s => s.name === DEFAULT_SORT_TYPE)[0]?.id
        ,
        [ possibleSortingTypes ],
    );
    
    return (
        <div className={styles.sortingTypeContainer}>
            <Heading
                type={HeadingType.small}
                className={styles.heading}
            >
                <div className={styles.buttonContainer}>
                    Sorting
                    <Button
                            type={ButtonType.secondary}
                            onClick={() => clearFilters(DEFAULT_SORT_FILTER_TYPE, defaultSortingId)}
                            className={styles.button}
                            text='clear sorting'
                            size={ButtonSize.small}
                        />
                </div>
            </Heading>
            <List
                values={possibleSortingTypes}
                itemFunc={getRenderSortingItemFunc}
                orientation={Orientation.horizontal}
                className={styles.sortTypesList}
                itemClassName={styles.listSortingItem}
            />
        </div>
    );
};

export default ContestSorting;
