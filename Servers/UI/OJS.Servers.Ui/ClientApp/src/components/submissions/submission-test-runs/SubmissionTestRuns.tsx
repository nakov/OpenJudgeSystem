import { useState } from 'react';
import { BiMemoryCard } from 'react-icons/bi';
import { FaCheck, FaRegClock } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoCloseSharp } from 'react-icons/io5';

import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { testResultTypes } from '../submission-test-run/SubmissionTestRun';

import styles from './SubmissionTestRuns.module.scss';

interface ISubmissionTestRunsProps {
    testRuns?: ITestRunType[];
}

const SubmissionTestRuns = (props: ISubmissionTestRunsProps) => {
    const { testRuns } = props;
    const { themeColors, getColorClassName } = useTheme();
    const [ selectedTestRun, setSelectedTestRun ] = useState<number>(1);

    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    const renderTestRunDetails = (testRun: ITestRunType, idx: number) => {
        const { resultType } = testRun;

        const getTestColorByResultType = (resType: string) => {
            if (resType === testResultTypes.wrongAnswer) {
                return '#fc4c50';
            }
            if (resType === testResultTypes.correctAnswer) {
                return '#23be5e';
            }
            return '#fec112';
        };

        const getIconByResultType = (resType: string, color: string) => {
            if (resType === testResultTypes.wrongAnswer) {
                return <IoCloseSharp size={20} color={color} />;
            }
            if (resType === testResultTypes.correctAnswer) {
                return <FaCheck size={20} color={color} />;
            }
            if (resType === testResultTypes.timeLimit) {
                return <FaRegClock size={20} color={color} />;
            }
            if (resType === testResultTypes.memoryLimit) {
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
