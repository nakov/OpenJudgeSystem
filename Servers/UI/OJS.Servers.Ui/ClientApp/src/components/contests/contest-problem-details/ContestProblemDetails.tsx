import React from 'react';
import Tabs from '../../guidelines/tabs/Tabs';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import ProblemSubmissions from '../../problems/problem-submissions/ProblemSubmissions';
import { useContests } from '../../../hooks/use-contests';
import styles from './ContestProblemDetails.module.scss';

const ContestProblemDetails = () => {
    // TODO: remove this. Use `useProblems` inside `ProblemResources`
    const { currentProblem } = useContests();

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
