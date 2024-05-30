/* eslint-disable import/exports-last */
import React, { useState } from 'react';
import { BiMemoryCard } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Popover } from '@mui/material';

import { TestRunResultType } from '../../../common/constants';
import { getResultTypeText, getTestResultColorId } from '../../../common/submissions-utils';
import { NEW_ADMINISTRATION_PATH } from '../../../common/urls/administration-urls';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import CodeEditor from '../../code-editor/CodeEditor';
import Diff from '../../diff/Diff';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';

import styles from './SubmissionTestRun.module.scss';

interface ISubmissionTestRunProps {
    testRun: ITestRunType;
    idx: number;
    shouldRenderAdminData?: boolean;
}

const SubmissionTestRun = (props: ISubmissionTestRunProps) => {
    const { testRun, idx, shouldRenderAdminData = false } = props;

    const { isDarkMode, themeColors, getColorClassName } = useTheme();
    const navigate = useNavigate();

    const [ testShowInput, setTestShowInput ] = useState<boolean>(false);
    const [ memoryAnchorEl, setMemoryAnchorEl ] = useState<HTMLElement | null>(null);
    const [ timeAnchorEl, setTimeAnchorEl ] = useState<HTMLElement | null>(null);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    const isMemoryModalOpen = Boolean(memoryAnchorEl);
    const isTimeModalOpen = Boolean(timeAnchorEl);

    const {
        input,
        testId,
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

    const onShowHideInputButtonClick = () => {
        setTestShowInput(!testShowInput);
    };

    const isCorrectAnswer = resultType.toLowerCase() === TestRunResultType.CorrectAnswer.toLowerCase();

    return (
        <div
          key={`test-run-${testRun.id}`}
          id={`test-run-${testRun.id}`}
          className={`${backgroundColorClassName} ${textColorClassName} ${styles.testRunWrapper}`}
        >
            <div className={styles.testRunTitleWrapper}>
                <div className={styles.testNameButtonWrapper}>
                    <div style={{ color: getTestResultColorId(resultType) }}>
                        { isTrialTest && 'Zero '}
                        Test #
                        { idx }
                        { !isCorrectAnswer && ` (${getResultTypeText(resultType)})` }
                    </div>
                </div>
                <div className={styles.testDetailsAndMemoryWrapper}>
                    { showInput && (
                        <Button
                          onClick={() => onShowHideInputButtonClick()}
                          text={testShowInput
                              ? 'HIDE INPUT'
                              : 'SHOW INPUT'}
                          type={isDarkMode
                              ? ButtonType.lightNeutral
                              : ButtonType.darkNeutral}
                          size={ButtonSize.small}
                        />
                    )}
                    { shouldRenderAdminData && (
                        <div
                          className={`${styles.testRunIdWrapper}`}
                          onClick={() => navigate(`/${NEW_ADMINISTRATION_PATH}/tests/${testId}`)}
                        >
                            Test #
                            {testId}
                        </div>
                    )}
                    <div className={styles.timeAndMemoryWrapper}>
                        <span style={{ color: themeColors.baseColor100 }}>
                            Run #
                            {testRun.id}
                        </span>
                        <span
                          onMouseEnter={(e) => onPopoverOpen('memory', e)}
                          onMouseLeave={() => onPopoverClose('memory')}
                        >
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
                        <span
                          onMouseEnter={(e) => onPopoverOpen('time', e)}
                          onMouseLeave={() => onPopoverClose('time')}
                        >
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
            </div>
            {testShowInput && (
                <>
                    <div>Test input:</div>
                    <CodeEditor code={input} readOnly customEditorStyles={{ height: '150px', marginTop: '12px' }} />
                </>
            )}
            {(expectedOutputFragment || userOutputFragment) && (
                <div className={styles.outputWrapper}>
                    <Diff expectedStr={expectedOutputFragment} actualStr={userOutputFragment} />
                </div>
            )}
            {
                testRun.resultType.toLowerCase() === TestRunResultType.RunTimeError.toLowerCase() && testRun.executionComment && (
                    <div className={styles.runtimeExecutionComment}>{testRun.executionComment}</div>
                )
            }
        </div>
    );
};

export default SubmissionTestRun;
