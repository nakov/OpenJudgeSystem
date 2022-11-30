import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { ISort } from '../../../common/contest-types';
import { useContests } from '../../../hooks/use-contests';
import { splitByCapitalLetter } from '../../../utils/string-utils';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { Orientation } from '../../guidelines/lists/List';

import styles from './ContestSorting.module.scss';

interface IContestSortingProps {
    onSortClick: (sorting: ISort) => void;
}

const ContestSorting = ({ onSortClick }: IContestSortingProps) => {
    const {
        state:
            {
                possibleSortingTypes,
                sortingTypes,
            },
        actions: { clearSorts },
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

    const renderSortingItemFunc = useCallback(
        (value : ISort) => {
            const { id, name } = value;
            const sortingIsSelected = sortingTypes.some((s) => s.name === name);
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
        [ handleOnSortClick, sortingTypes ],
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
                      onClick={() => clearSorts()}
                      className={styles.button}
                      text="clear sorting"
                      size={ButtonSize.small}
                    />
                </div>
            </Heading>
            <List
              values={possibleSortingTypes}
              itemFunc={renderSortingItemFunc}
              orientation={Orientation.horizontal}
              className={styles.sortTypesList}
              fullWidth
            />
        </div>
    );
};

export default ContestSorting;
