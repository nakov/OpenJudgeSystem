import * as React from 'react';
import { useCallback } from 'react';
import { useSubmissions } from '../../../hooks/use-submissions';
import Heading from '../../guidelines/headings/Heading';
import Diff from '../../Diff';

const SubmissionResults = () => {
    const { currentSubmission } = useSubmissions();

    const renderSubmissionResults = useCallback(() => {
        if (currentSubmission) {
            return currentSubmission.testRuns.map((run) => (
                <>
                    {/* <TestRunHeading testRun={run} /> */}
                    <Heading type="secondary">
                        {run.id}
                    </Heading>
                    {
                        run.resultType === 'WrongAnswer'
                            ? <Diff expectedStr={run.expectedOutputFragment} actualStr={run.userOutputFragment} />
                            : 'Correct'
                    }
                </>
            ));
        }
        return null;
    }, [ currentSubmission ]);

    return (
        <>
            {renderSubmissionResults()}
        </>
    );
};

export default SubmissionResults;
