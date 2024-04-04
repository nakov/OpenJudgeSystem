import { FaCheck } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoCloseSharp } from 'react-icons/io5';

import { ITestRun } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRun[];
}

const WRONG_ANSWER = 'WrongAnswer';
const CORRECT_ANSWER = 'CorrectAnswer';

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { themeColors, getColorClassName } = useTheme();

    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    const renderTestRunDetails = (testRun: ITestRun, idx: number) => {
        const { resultType } = testRun;

        const getTestColorByResultType = (resType: string) => {
            if (resType === WRONG_ANSWER) {
                return 'red';
            } if (resType === CORRECT_ANSWER) {
                return 'green';
            }
            return 'yellow';
        };

        const getIconByResultType = (resType: string, color: string) => {
            if (resType === WRONG_ANSWER) {
                return <IoCloseSharp size={20} color={color} />;
            } if (resType === CORRECT_ANSWER) {
                return <FaCheck size={20} color={color} />;
            }

            return <GoPrimitiveDot size={20} color={color} />;
        };

        const color = getTestColorByResultType(resultType);

        return (
            <div className={styles.submissionTestRun} style={{ color }}>
                <span>
                    {idx + 1}
                    .
                </span>
                {getIconByResultType(resultType, color)}
            </div>
        );
    };

    if (!testRuns || testRuns?.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.submissionsTestRunsWrapper} ${backgroundColorClassName}`}>
            {testRuns?.map((testRun, idx) => renderTestRunDetails(testRun, idx))}
        </div>
    );
};

export default SubmissionTestRuns;
