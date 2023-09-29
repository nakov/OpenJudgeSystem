import React, { useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { useProblems } from '../../../hooks/use-problems';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import QuestionIcon from '../../guidelines/icons/QuestionIcon';
import List from '../../guidelines/lists/List';

import styles from './ProblemConstraints.module.scss';

const ProblemConstraints = () => {
    const { state: { currentProblem } } = useProblems();

    const constraints = useMemo(() => {
        if (isNil(currentProblem)) {
            return [];
        }

        const { memoryLimit, fileSizeLimit, timeLimit, checkerName } = currentProblem;

        return [
            !isNil(timeLimit)
                ? `Allowed working time: ${timeLimit.toFixed(3).toString()} sec.`
                : '',
            !isNil(memoryLimit)
                ? `Allowed memory: ${memoryLimit.toFixed(2).toString()} MB`
                : '',
            !isNil(fileSizeLimit)
                ? `Size limit: ${fileSizeLimit.toFixed(2).toString()} KB`
                : '',
            !isNil(checkerName)
                ? `Checker: ${checkerName}`
                : '',
        ].filter((item) => !isEmpty(item));
    }, [ currentProblem ]);

    const renderConstraint = useCallback((constraint: string) => {
        const { checkerDescription = '' } = currentProblem || {};

        const constraintElement = <span>{constraint}</span>;

        return constraint.toLowerCase().includes('checker')
            ? (
                <>
                    {constraintElement}
                    <QuestionIcon
                      className={styles.questionIcon}
                      size={IconSize.Medium}
                      helperText={checkerDescription}
                    />
                </>
            )
            : constraintElement;
    }, [ currentProblem ]);

    return (
        <div className={styles.constraints}>
            <List
              values={constraints}
              itemFunc={renderConstraint}
              className={styles.constraintsList}
            />
        </div>
    );
};

export default ProblemConstraints;
