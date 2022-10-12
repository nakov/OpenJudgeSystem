import React, { useCallback } from 'react';
import { isNil } from 'lodash';
import { useContests } from '../../../hooks/use-contests';
import { ISort } from '../../../common/contest-types';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import List, { Orientation } from '../../guidelines/lists/List';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { splitByCapitalLetter } from '../../../utils/string-utils';

import styles from './ContestSorting.module.scss';

interface IContestSortingProps {
    onSortClick: (sorting: ISort) => void;
}

const ContestSorting = ({ onSortClick }: IContestSortingProps) => {
    const { state: { possibleSorting } } = useContests();
    
    const handleOnSortClick = useCallback(
        (sortId: number) => {
            const sorting = possibleSorting.find(({ id }) => sortId === id);

            if (isNil(sorting)) {
                return;
            }

            onSortClick(sorting);
        },
        [ possibleSorting, onSortClick ],
    );

    const getRenderSortingItemFunc = useCallback(
        (value : ISort) => {
            const { id, name } = value;
            const sortingIsSelected = possibleSorting.some((s) => s.name === name);
            const buttonType = sortingIsSelected
                ? ButtonType.primary
                : ButtonType.secondary;
            
            return (<Button
                type={buttonType}
                onClick={() => handleOnSortClick(id)}
                className={styles.btnSelectFilter}
                text={splitByCapitalLetter(name)}
                size={ButtonSize.small}
            />);
        },
        [ handleOnSortClick, possibleSorting ],
    );
    
    const listOrientation = Orientation.horizontal;
    
    return (
        <div className={styles.sortingTypeContainer}>
            <Heading
                type={HeadingType.small}
                className={styles.heading}
            >
                Sorting
            </Heading>
            <List
                values={possibleSorting}
                itemFunc={getRenderSortingItemFunc}
                orientation={listOrientation}
                className={styles.sortTypesList}
                itemClassName={styles.listSortingItem}
            />
        </div>
    );
};

export default ContestSorting;
