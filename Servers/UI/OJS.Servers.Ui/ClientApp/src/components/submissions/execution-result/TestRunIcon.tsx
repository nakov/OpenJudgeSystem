import React, { useCallback, useState } from 'react';
import { Popover } from '@mui/material';

import { TestRunResultType } from '../../../common/constants';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import { toLowerCase } from '../../../utils/string-utils';
import ErrorIcon from '../../guidelines/icons/ErrorIcon';
import MemoryLimitIcon from '../../guidelines/icons/MemoryLimitIcon';
import RuntimeErrorIcon from '../../guidelines/icons/RuntimeErrorIcon';
import TickIcon from '../../guidelines/icons/TickIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import WrongAnswerIcon from '../../guidelines/icons/WrongAnswerIcon';

import styles from '../submission-grid-row/SubmissionGridRow.module.scss';

interface ITestRunIconProps {
    testRun: ITestRunType;
}

const TestRunIcon = ({ testRun }: ITestRunIconProps) => {
    const { getColorClassName, themeColors } = useTheme();
    const [ competeIconAnchorElement, setCompeteIconAnchorElement ] = useState<HTMLElement | null>(null);

    const isIconModalOpen = Boolean(competeIconAnchorElement);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor100);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setCompeteIconAnchorElement(event.currentTarget);
    };

    const renderTestRunIcon = useCallback(
        () => {
            switch (toLowerCase(testRun.resultType)) {
            // TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/1287
            case TestRunResultType.CorrectAnswer.toLowerCase(): return <TickIcon key={testRun.id} />;
            case TestRunResultType.WrongAnswer.toLowerCase(): return <WrongAnswerIcon key={testRun.id} />;
            case TestRunResultType.MemoryLimit.toLowerCase(): return <MemoryLimitIcon key={testRun.id} />;
            case TestRunResultType.TimeLimit.toLowerCase(): return <TimeLimitIcon key={testRun.id} />;
            case TestRunResultType.RunTimeError.toLowerCase(): return <RuntimeErrorIcon key={testRun.id} />;
            default: return (
                <ErrorIcon />
            );
            }
        },
        [ testRun.id, testRun.resultType ],
    );

    const getPopoverText = () => {
        switch (testRun.resultType.toLowerCase()) {
        case TestRunResultType.CorrectAnswer.toLowerCase():
            return 'Correct Answer';
        case TestRunResultType.WrongAnswer.toLowerCase():
            return 'Wrong Answer';
        case TestRunResultType.MemoryLimit.toLowerCase():
            return 'Memory Limit';
        case TestRunResultType.TimeLimit.toLowerCase():
            return 'Time Limit';
        case TestRunResultType.RunTimeError.toLowerCase():
            return 'Runtime Error';

        default:
            return '';
        }
    };

    return (
        <span
          onMouseEnter={(e) => onPopoverOpen(e)}
          onMouseLeave={() => setCompeteIconAnchorElement(null)}
        >
            <Popover
              open={isIconModalOpen}
              anchorEl={competeIconAnchorElement}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}
              sx={{ pointerEvents: 'none' }}
              onClose={() => setCompeteIconAnchorElement(null)}
              disableRestoreFocus
            >
                <div className={`${styles.competeIconModal} ${backgroundColorClassName}`}>
                    {getPopoverText()}
                </div>
            </Popover>
            {renderTestRunIcon()}
        </span>
    );
};

export default TestRunIcon;
