import React, { useMemo } from 'react';

import concatClassNames from '../../../utils/class-names';
import Label, { LabelType } from '../../guidelines/labels/Label';

import styles from './SubmissionResultPointsLabel.module.scss';

interface ISubmissionResultPointsLabelProps {
    points: number;
    maximumPoints: number;
    isProcessed: boolean;
    testRunsCount: number;
}

const SubmissionResultPointsLabel = ({
    points,
    maximumPoints,
    isProcessed,
    testRunsCount,
}: ISubmissionResultPointsLabelProps) => {
    const labelType = useMemo(
        () => !isProcessed && testRunsCount === 0
            ? LabelType.plain
            : (points === 0 && isProcessed) || testRunsCount === 0
                ? LabelType.warning
                : points === maximumPoints
                    ? LabelType.success
                    : LabelType.info,
        [ points, isProcessed, maximumPoints, testRunsCount ],
    );

    const currentPoints = useMemo(
        () => isProcessed
            ? points
            : '?',
        [ isProcessed, points ],
    );

    const text = useMemo(
        () => `${currentPoints}/${maximumPoints}`,
        [ currentPoints, maximumPoints ],
    );

    const internalClassName = concatClassNames(styles.resultLabel, 'resultLabel');

    return (
        <Label
          className={internalClassName}
          type={labelType}
        >
            {text}
        </Label>
    );
};

export default SubmissionResultPointsLabel;
