import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { ISubmissionDetailsReduxState } from '../../common/types';
import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { setLayout } from '../shared/set-layout';

const SubmissionPage = () => {
    const { currentSubmission } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);

    if (isNil(currentSubmission)) {
        return <>No details.</>;
    }

    const { testRuns, isCompiledSuccessfully, compilerComment } = currentSubmission;

    return (
        <>
            <SubmissionDetailsHeading />
            <SubmissionResults
              testRuns={testRuns}
              isCompiledSuccessfully={isCompiledSuccessfully}
              compilerComment={compilerComment}
            />
        </>
    );
};

export default setLayout(SubmissionPage);
