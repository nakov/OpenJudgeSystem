import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { useProblems } from '../../../hooks/use-problems';
import { format } from '../../../utils/number-utils';
import List from '../../guidelines/lists/List';

import styles from './ProblemConstraints.module.scss';

const ProblemConstraints = () => {
    const { state: { currentProblem } } = useProblems();

    const getConstraints = useCallback(() => {
        if (isNil(currentProblem) ||
            isNil(currentProblem.memoryLimit) ||
            isNil(currentProblem.fileSizeLimit) ||
            isNil(currentProblem.timeLimit) ||
            isNil(currentProblem.checkerName)) {
            return [];
        }

        const { memoryLimit, fileSizeLimit, timeLimit, checkerName } = currentProblem;

        return [ `Allowed working time: ${format(timeLimit).toString()} sec.`,
            `Allowed memory: ${format(memoryLimit).toString()} MB`,
            `Size limit: ${format(fileSizeLimit).toString()} MB`,
            `Checker: ${checkerName}` ];
    }, [ currentProblem ]);

    const renderConstraint = (constraint: string) => <span>{constraint}</span>;

    return (
        <List
          values={getConstraints()}
          itemFunc={renderConstraint}
          className={styles.constraintsList}
        />
    );
};

export default ProblemConstraints;
