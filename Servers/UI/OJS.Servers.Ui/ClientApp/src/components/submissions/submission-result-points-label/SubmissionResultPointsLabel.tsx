import * as React from 'react';
import { useCallback } from 'react';
import Label, { LabelType } from '../../guidelines/labels/Label';
import styles from './SubmissionResultPointsLabel.module.scss';

interface ISubmissionResultPointsLabelProps {
    points: number;
    maximumPoints: number;
    isProcessed: boolean
}

const SubmissionResultPointsLabel = ({
    points,
    maximumPoints,
    isProcessed,
}: ISubmissionResultPointsLabelProps) => {
    const render = useCallback(
        () => {
            const type = points === 0
                ? LabelType.warning
                : points === 100
                    ? LabelType.success
                    : LabelType.info;

            const currentPoints = isProcessed
                ? points
                : '?';

            const text = `${currentPoints}/${maximumPoints}`;

            return (
                <Label
                  className={styles.resultLabel}
                  type={type}
                >
                    {text}
                </Label>
            );
        },
        [ isProcessed, maximumPoints, points ],
    );

    return render();
};

export default SubmissionResultPointsLabel;
