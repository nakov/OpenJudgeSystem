import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ISubmissionDetailsReduxState } from '../../../../common/types';
import Heading from '../../../guidelines/headings/Heading';

const SubmissionDetailsHeading = () => {
    const { currentSubmission } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);

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
