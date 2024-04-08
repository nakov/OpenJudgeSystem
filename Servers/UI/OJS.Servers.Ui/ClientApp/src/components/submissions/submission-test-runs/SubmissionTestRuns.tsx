import { useState } from 'react';
import { BiMemoryCard } from 'react-icons/bi';
import { FaCheck, FaRegClock } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoCloseSharp } from 'react-icons/io5';

import { ITestRun } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { testResultTypes } from '../submission-test/SubmissionTest';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRun[];
}

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { themeColors, getColorClassName } = useTheme();
    const [ selectedTestRun, setSelectedTestRun ] = useState<number>(1);

    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    const renderTestRunDetails = (testRun: ITestRun, idx: number) => {
        const { resultType } = testRun;

        const getTestColorByResultType = (resType: string) => {
            if (resType === testResultTypes.wrongAnswer) {
                return 'red';
            } if (resType === testResultTypes.correctAnswer) {
                return 'green';
            }
            return 'yellow';
        };

        const getIconByResultType = (resType: string, color: string) => {
            if (resType === testResultTypes.wrongAnswer) {
                return <IoCloseSharp size={20} color={color} />;
            } if (resType === testResultTypes.correctAnswer) {
                return <FaCheck size={20} color={color} />;
            } if (resType === testResultTypes.timeLimit) {
                return <FaRegClock size={20} color={color} />;
            } if (resType === testResultTypes.memoryLimit) {
                return <BiMemoryCard size={20} color={color} />;
            }

            return <GoPrimitiveDot size={20} color={color} />;
        };

        const onTestRunClick = (i: number) => {
            setSelectedTestRun(i);
            const scrollToElement = document.querySelector(`#test-run-${testRun.id}`);
            if (!scrollToElement) { return; }

            const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        };

        const color = getTestColorByResultType(resultType);

        return (
            <div
              className={`${styles.submissionTestRun} ${selectedTestRun === idx
                  ? styles.selectedTestRun
                  : ''}`}
              style={{ color }}
              onClick={() => onTestRunClick(idx)}
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
