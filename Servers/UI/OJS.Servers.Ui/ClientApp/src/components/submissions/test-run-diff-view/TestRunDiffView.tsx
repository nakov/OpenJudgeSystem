import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import Diff from '../../Diff';

interface ITestRunDiffViewProps {
    testRun: ITestRunDetailsType;
}

const TestRunDiffView = ({ testRun }: ITestRunDiffViewProps) => (
    <Diff
      expectedStr={testRun.expectedOutputFragment}
      actualStr={testRun.userOutputFragment}
    />
);

export default TestRunDiffView;
