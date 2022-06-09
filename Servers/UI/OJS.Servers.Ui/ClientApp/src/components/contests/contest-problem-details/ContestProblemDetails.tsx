import React from 'react';
import Tabs from '../../guidelines/tabs/Tabs';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import ProblemSubmissions from '../../problems/problem-submissions/ProblemSubmissions';
import styles from './ContestProblemDetails.module.scss';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';

const ContestProblemDetails = () => {
    // TODO: remove this. Use `useProblems` inside `ProblemResources`
    const { state: { currentProblem } } = useProblems();
    const contestTabControlsClass = 'contestTabControls';
    const contestTabControlsClassName = concatClassNames(styles.contestTabControls, contestTabControlsClass);
    const contestTabsClassName = 'contestTabs';

    return (
        <div className={contestTabControlsClassName}>
            <Tabs
              tabLabels={[ 'Problem', 'Submissions' ]}
              className={contestTabsClassName}
              tabChildren={[
                  <ProblemResources resources={currentProblem?.resources} />,
                  <ProblemSubmissions />,
              ]}
            />
        </div>
    );
};

export default ContestProblemDetails;
