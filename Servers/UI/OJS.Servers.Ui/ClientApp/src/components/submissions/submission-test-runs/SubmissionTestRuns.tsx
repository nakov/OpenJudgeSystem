import { GoPrimitiveDot } from 'react-icons/go';

import { ITestRun } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRun[];
}

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { themeColors, getColorClassName } = useTheme();

    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    return (
        <div className={`${styles.submissionsTestRunsWrapper} ${backgroundColorClassName}`}>
            <div className={styles.submissionTestRun}>
                <span>1.</span>
                <GoPrimitiveDot size={10} />
            </div>
            <div className={styles.submissionTestRun}>
                <span>2.</span>
                <GoPrimitiveDot size={10} />
            </div>
            <div className={styles.submissionTestRun}>
                <span>3.</span>
                <GoPrimitiveDot size={10} />
            </div>
            <div className={styles.submissionTestRun}>
                <span>4.</span>
                <GoPrimitiveDot size={10} />
            </div>
        </div>
    );
};

export default SubmissionTestRuns;
