import React from 'react';
import Tabs from '../../guidelines/tabs/Tabs';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import ProblemSubmissions from '../../problems/problem-submissions/ProblemSubmissions';
import styles from './ContestProblemDetails.module.scss';
import { useProblems } from '../../../hooks/use-problems';

const ContestProblemDetails = () => {
    // TODO: remove this. Use `useProblems` inside `ProblemResources`
    const { state: { currentProblem } } = useProblems();

    return (
        <div className={styles.contestTabControls}>
            <Tabs
              tabLabels={[ 'Problem', 'Submissions' ]}
              tabChildren={[
                  <ProblemResources resources={currentProblem?.resources} />,
                  <ProblemSubmissions />,
              ]}
            />
        </div>
    );
};

export default ContestProblemDetails;
