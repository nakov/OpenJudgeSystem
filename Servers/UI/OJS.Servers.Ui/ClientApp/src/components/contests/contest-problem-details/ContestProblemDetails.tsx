import React from 'react';
import Tabs from '../../guidelines/tabs/Tabs';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import SubmissionResults from '../../problems/problem-submissions/SubmissionResults';
import { useContests } from '../../../hooks/contests/use-contests';
import styles from './ContestProblemDetails.module.scss';

const ContestProblemDetails = () => {
    const { currentProblem } = useContests();

    return (
        <div className={styles.contestTabControls}>
            <Tabs
              tabLabels={[ 'Problem', 'Submissions' ]}
              tabChildren={[
                  <ProblemResources resources={currentProblem?.resources} />,
                  <SubmissionResults problemId={currentProblem?.id} />,
              ]}
            />
        </div>
    );
};

export default ContestProblemDetails;
