/* eslint-disable import/exports-last */
import React, { useMemo, useState } from 'react';
import { BiMemoryCard } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { Popover } from '@mui/material';

import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import Diff from '../../diff/Diff';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';

import styles from './SubmissionTestRun.module.scss';

interface ISubmissionTestRun {
    testRun: ITestRunType;
    idx: number;
}

export const enum testResultTypes {
    correctAnswer = 'CorrectAnswer',
    wrongAnswer = 'WrongAnswer',
    runTimeError = 'RunTimeError',
    timeLimit = 'TimeLimit',
    memoryLimit = 'MemoryLimit'
}

const SubmissionTest = (props: ISubmissionTestRun) => {
    const { testRun, idx } = props;

    const { themeColors, getColorClassName } = useTheme();

    const [ testShowInput, setTestShowInput ] = useState<boolean>(false);
    const [ memoryAnchorEl, setMemoryAnchorEl ] = useState<HTMLElement | null>(null);
    const [ timeAnchorEl, setTimeAnchorEl ] = useState<HTMLElement | null>(null);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    const isMemoryModalOpen = Boolean(memoryAnchorEl);
    const isTimeModalOpen = Boolean(timeAnchorEl);

    const {
        input,
        resultType,
        isTrialTest,
        memoryUsed,
        showInput,
        timeUsed,
        expectedOutputFragment,
        userOutputFragment,
    } = testRun;

    const onPopoverClose = (popover: string) => {
        if (popover === 'memory') {
            setMemoryAnchorEl(null);
        } if (popover === 'time') {
            setTimeAnchorEl(null);
        }
    };

    const onPopoverOpen = (popover: string, event: React.MouseEvent<HTMLElement>) => {
        if (popover === 'memory') {
            setMemoryAnchorEl(event.currentTarget);
        } if (popover === 'time') {
            setTimeAnchorEl(event.currentTarget);
        }
    };

    const textIdColor = useMemo(() => {
        if (resultType === testResultTypes.wrongAnswer) {
            return 'red';
        } if (resultType === testResultTypes.correctAnswer) {
            return 'green';
        }
        return 'yellow';
    }, [ resultType ]);

    const onShowHideInputButtonClick = () => {
        setTestShowInput(!testShowInput);
    };
    return (
        <div
          key={`test-run-${testRun.id}`}
          id={`test-run-${testRun.id}`}
          className={`${backgroundColorClassName} ${textColorClassName} ${styles.testRunWrapper}`}
        >
            <div className={styles.testRunTitleWrapper}>
                <div className={styles.testNameButtonWrapper}>
                    <div style={{ color: textIdColor }}>
                        Test #
                        {idx}
                    </div>
                    { showInput && (
                        <Button
                          onClick={() => onShowHideInputButtonClick()}
                          text={testShowInput
                              ? 'HIDE INPUT'
                              : 'SHOW INPUT'}
                          type={ButtonType.neutral}
                          size={ButtonSize.small}
                        />
                    )}
                </div>
                <div className={styles.timeAndMemoryWrapper}>
                    <span onMouseEnter={(e) => onPopoverOpen('memory', e)} onMouseLeave={() => onPopoverClose('memory')}>
                        <BiMemoryCard size={20} color={themeColors.baseColor100} />
                        <span>
                            {(memoryUsed / 1000000).toFixed(2)}
                            {' '}
                            MB
                        </span>
                        <Popover
                          open={isMemoryModalOpen}
                          anchorEl={memoryAnchorEl}
                          anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                          }}
                          transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                          }}
                          sx={{ pointerEvents: 'none' }}
                          onClose={() => onPopoverClose('memory')}
                          disableRestoreFocus
                        >
                            <div className={`${styles.timeAndMemoryModal} ${backgroundColorClassName}`}>
                                Memory used
                            </div>
                        </Popover>
                    </span>
                    <span onMouseEnter={(e) => onPopoverOpen('time', e)} onMouseLeave={() => onPopoverClose('time')}>
                        <FaRegClock size={20} color={themeColors.baseColor100} />
                        <span>
                            {timeUsed / 1000}
                            {' '}
                            s.
                        </span>
                        <Popover
                          open={isTimeModalOpen}
                          anchorEl={timeAnchorEl}
                          anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                          }}
                          transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                          }}
                          sx={{ pointerEvents: 'none' }}
                          onClose={() => onPopoverClose('time')}
                          disableRestoreFocus
                        >
                            <div className={`${styles.timeAndMemoryModal} ${backgroundColorClassName}`}>
                                Time required
                            </div>
                        </Popover>
                    </span>
                </div>
            </div>
            {testShowInput && (<div className={styles.inputWrapper} style={{ backgroundColor: themeColors.baseColor100 }}>{input}</div>)}
            {isTrialTest && resultType === testResultTypes.wrongAnswer && (
                <div className={styles.outputWrapper}>
                    <Diff expectedStr={expectedOutputFragment} actualStr={userOutputFragment} />
                </div>
            )}
        </div>
    );
};

export default SubmissionTest;
