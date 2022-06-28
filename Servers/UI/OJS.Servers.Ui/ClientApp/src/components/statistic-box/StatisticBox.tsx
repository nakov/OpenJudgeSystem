import React, { ReactNode, useCallback, useMemo } from 'react';
import { isNil } from 'lodash';
import { IStatistic } from '../../common/statistics-types';
import concatClassNames from '../../utils/class-names';

import styles from './StatisticBox.module.scss';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import { format } from '../../utils/number-utils';

enum StatisticBoxSize {
    small = 1,
    medium = 2,
    big = 3,
}

interface IStatisticBoxProps {
    statistic: IStatistic;
    size?: StatisticBoxSize;
    renderIcon?: (() => ReactNode) | null;
}

const StatisticBox = ({
    statistic,
    size = StatisticBoxSize.medium,
    renderIcon = null,
}: IStatisticBoxProps) => {
    const { name, value } = statistic;
    const sizeClassName = size === StatisticBoxSize.big
        ? styles.big
        : size === StatisticBoxSize.small
            ? styles.small
            : '';

    const boxClassName = useMemo(
        () => concatClassNames(styles.box, sizeClassName),
        [ sizeClassName ],
    );

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
        <div className={boxClassName}>
            {renderIconInternal()}
            <div className={styles.valuesContainer}>
                <Heading type={HeadingType.small}>{name}</Heading>
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
