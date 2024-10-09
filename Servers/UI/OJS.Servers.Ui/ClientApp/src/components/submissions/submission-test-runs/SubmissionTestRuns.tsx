import { getTestResultColorId } from '../../../common/submissions-utils';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import TestRunIcon from '../execution-result/TestRunIcon';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRunType[];
}

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { isDarkMode, themeColors, getColorClassName } = useTheme();

    const backgroundColorClassName = getColorClassName(isDarkMode
        ? themeColors.baseColor300
        : themeColors.baseColor100);

    const renderTestRunDetails = (testRun: ITestRunType, idx: number) => {
        const { resultType } = testRun;

        const onTestRunClick = () => {
            const scrollToElement = document.querySelector(`#test-run-${testRun.id}`);
            if (!scrollToElement) { return; }

            const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        };

        const color = getTestResultColorId(resultType);

        return (
            <div
              key={`tr-${testRun.id}`}
              className={styles.submissionTestRun}
              style={{ color }}
              onClick={() => onTestRunClick()}
            >
                <span>
                    {`${testRun.isTrialTest
                        ? '0.'
                        : ''}${idx}`}
                    .
                </span>
                <TestRunIcon testRun={testRun} />
            </div>
        );
    };

    if (!testRuns || testRuns?.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.submissionsTestRunsWrapper} ${backgroundColorClassName}`}>
            {testRuns?.filter((tr) => tr.isTrialTest).map((testRun, idx) => renderTestRunDetails(testRun, idx + 1))}
            {testRuns?.filter((tr) => !tr.isTrialTest).map((testRun, idx) => renderTestRunDetails(testRun, idx + 1))}
        </div>
    );
};

export default SubmissionTestRuns;
