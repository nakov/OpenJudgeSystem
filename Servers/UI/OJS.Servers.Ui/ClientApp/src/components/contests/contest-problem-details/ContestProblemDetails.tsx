import { useMemo } from 'react';

import { useCurrentContest } from '../../../hooks/use-current-contest';
import concatClassNames from '../../../utils/class-names';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import ProblemConstraints from '../../problems/problem-constraints/ProblemConstraints';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import ProblemSubmissions from '../../problems/problem-submissions/ProblemSubmissions';

import styles from './ContestProblemDetails.module.scss';

const ContestProblemDetails = () => {
    const { state: { getParticipantScoresIsLoading } } = useCurrentContest();

    const parentClassNames = useMemo(
        () => concatClassNames(
            styles.problemDetailsContainer,
            'contestTabControls',
            getParticipantScoresIsLoading
                ? styles.centeredFlex
                : '',
        ),
        [ getParticipantScoresIsLoading ],
    );

    return (
        <div className={parentClassNames}>
            {getParticipantScoresIsLoading
                ? <SpinningLoader />
                : (
                    <>
                        <div className={styles.problemItems}>
                            <Heading type={HeadingType.secondary}>
                                Resources
                            </Heading>
                            <ProblemResources />
                        </div>
                        <div className={styles.problemItems}>
                            <Heading type={HeadingType.secondary}>
                                Constraints
                            </Heading>
                            <ProblemConstraints />
                        </div>
                        <div className={styles.problemItems}>
                            <ProblemSubmissions />
                        </div>
                    </>
                )}
        </div>
    );
};

export default ContestProblemDetails;
