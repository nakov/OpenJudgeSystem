import React, { useMemo } from 'react';
import isNil from 'lodash/isNil';

import concatClassNames from '../../../utils/class-names';
import Label, { LabelType } from '../../guidelines/labels/Label';

import styles from './SubmissionResultPointsLabel.module.scss';

interface ISubmissionResultPointsLabelProps {
    points: number;
    maximumPoints: number;
    isProcessed: boolean;
}

const SubmissionResultPointsLabel = ({
    points,
    maximumPoints,
    isProcessed,
}: ISubmissionResultPointsLabelProps) => {
    const labelType = points === 0 || isNil(points)
        ? LabelType.warning
        : points === 100
            ? LabelType.success
            : LabelType.info;

    const currentPoints = isProcessed
        ? points
        : '?';

    const text = useMemo(() => `${currentPoints}/${maximumPoints}`, [ currentPoints, maximumPoints ]);

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
