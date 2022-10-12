import React, { useCallback } from 'react';
import { isNil } from 'lodash';
import { useContests } from '../../../hooks/use-contests';
import { ISort } from '../../../common/contest-types';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import List, { Orientation } from '../../guidelines/lists/List';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestSorting.module.scss';

interface IContestSortingProps {
    onSortClick: (sorting: ISort) => void;
}

const ContestSorting = ({ onSortClick }: IContestSortingProps) => {
    const { state: { possibleSorting } } = useContests();
    
    const handleSortingClick = useCallback(
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

            const btnClassName = styles.btnSelectFilter;
            
            return (<Button
                type={buttonType}
                onClick={() => handleSortingClick(id)}
                className={btnClassName}
                text={name}
                size={ButtonSize.small}
            />);
        },
        [ handleSortingClick, possibleSorting ],
    );

    const headerName = 'Sorting';
    const listOrientation = Orientation.horizontal;
    
    return (
        <div className={styles.sortingTypeContainer}>
            <Heading
                type={HeadingType.small}
                className={styles.heading}
            >
                {headerName}
            </Heading>
            <List
                values={possibleSorting}
                itemFunc={getRenderSortingItemFunc}
                orientation={listOrientation}
                className={styles.listSorting}
                itemClassName={styles.listSortingItem}
            />
        </div>
    );
};

export default ContestSorting;
