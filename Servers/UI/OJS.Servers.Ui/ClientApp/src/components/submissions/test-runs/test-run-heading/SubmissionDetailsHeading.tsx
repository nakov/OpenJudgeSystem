import React, { useMemo } from 'react';

import { useSubmissionsDetails } from '../../../../hooks/submissions/use-submissions-details';
import Heading from '../../../guidelines/headings/Heading';

const SubmissionDetailsHeading = () => {
    const { state: { currentSubmission } } = useSubmissionsDetails();

    const getHeaderText = useMemo(
        () => `Solution #${currentSubmission?.id} for problem ${currentSubmission?.problem.name}`,
        [ currentSubmission ],
    );

    return (
        <>
            <Heading>
                {getHeaderText}
            </Heading>
            <p>{`By ${currentSubmission?.user.userName}`}</p>
        </>
    );
};

export default SubmissionDetailsHeading;
