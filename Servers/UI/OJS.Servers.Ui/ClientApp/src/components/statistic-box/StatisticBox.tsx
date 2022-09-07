import React, { ReactNode, useCallback, useMemo } from 'react';

import { isNil } from 'lodash';

import { format } from '../../utils/number-utils';

import { IStatistic } from '../code-editor/common/statistics-types';

import Heading, { HeadingType } from '../guidelines/headings/Heading';

import styles from './StatisticBox.module.scss';

enum StatisticBoxSize {
    small = 1,
    medium = 2,
    big = 3,
}

interface IStatisticBoxProps {
    statistic: IStatistic;
    renderIcon?: (() => ReactNode) | null;
}

const StatisticBox = ({
    statistic,
    renderIcon = null,
}: IStatisticBoxProps) => {
    const { name, value } = statistic;

    const formattedValue = useMemo(
        () => format(value),
        [ value ],
    );

    const renderIconInternal = useCallback(
        () => {
            if (isNil(renderIcon)) {
                return null;
            }

            return (
                <div>
                    {renderIcon()}
                </div>
            );
        },
        [ renderIcon ],
    );

    return (
        <div className={styles.box}>
            {renderIconInternal()}
            <div className={styles.valuesContainer}>
                <Heading
                  type={HeadingType.small}
                  className={styles.name}
                >
                    {name}
                </Heading>
                <Heading
                  className={styles.value}
                  type={HeadingType.secondary}
                >
                    {formattedValue}
                </Heading>
            </div>
        </div>
    );
};

export default StatisticBox;

export {
    StatisticBoxSize,
};
