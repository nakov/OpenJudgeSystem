import { BiMemoryCard } from 'react-icons/bi';
import { FaCheck, FaRegClock } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoCloseSharp } from 'react-icons/io5';

import { TestRunResultType } from '../../../common/constants';
import { getTestResultColorId } from '../../../common/submissions-utils';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRunType[];
}

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { themeColors, getColorClassName } = useTheme();

    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    const renderTestRunDetails = (testRun: ITestRunType, idx: number) => {
        const { resultType } = testRun;

        const getIconByResultType = (resType: string, color: string) => {
            // TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/1287
            if (resType.toLowerCase() === TestRunResultType.WrongAnswer.toLowerCase()) {
                return <IoCloseSharp size={20} color={color} />;
            }
            if (resType.toLowerCase() === TestRunResultType.CorrectAnswer.toLowerCase()) {
                return <FaCheck size={20} color={color} />;
            }
            if (resType.toLowerCase() === TestRunResultType.TimeLimit.toLowerCase()) {
                return <FaRegClock size={20} color={color} />;
            }
            if (resType.toLowerCase() === TestRunResultType.MemoryLimit.toLowerCase()) {
                return <BiMemoryCard size={20} color={color} />;
            }

            return <GoPrimitiveDot size={20} color={color} />;
        };

        const onTestRunClick = () => {
            const scrollToElement = document.querySelector(`#test-run-${testRun.id}`);
            if (!scrollToElement) { return; }

            const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        };

        const color = getTestResultColorId(resultType);

        return (
            <div
              className={`${styles.submissionTestRun} ${testRun.isTrialTest
                  ? styles.trialTest
                  : ''}`}
              style={{ color }}
              onClick={() => onTestRunClick()}
            >
                <span>
                    {idx}
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
            {testRuns?.map((testRun, idx) => renderTestRunDetails(testRun, idx + 1))}
        </div>
    );
};

export default SubmissionTestRuns;
