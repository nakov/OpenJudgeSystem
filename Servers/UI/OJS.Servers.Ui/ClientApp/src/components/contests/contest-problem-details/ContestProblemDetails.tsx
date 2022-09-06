import React from 'react';
import styles from './ContestProblemDetails.module.scss';
import concatClassNames from '../../../utils/class-names';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import ProblemSubmissions from '../../problems/problem-submissions/ProblemSubmissions';

const ContestProblemDetails = () => {
    const contestTabControlsClass = 'contestTabControls';
    const problemDetailsContainer = concatClassNames(styles.problemDetailsContainer, contestTabControlsClass);
    // const contestTabsClassName = 'contestTabs';

    return (
        <div className={problemDetailsContainer}>
            <div>
                <Heading type={HeadingType.secondary}>
                    Resources
                </Heading>
                <ProblemResources />
            </div>
            <div>
                <Heading type={HeadingType.secondary}>
                    Submissions
                </Heading>
                <ProblemSubmissions />
            </div>
        </div>
    );
};

export default ContestProblemDetails;
