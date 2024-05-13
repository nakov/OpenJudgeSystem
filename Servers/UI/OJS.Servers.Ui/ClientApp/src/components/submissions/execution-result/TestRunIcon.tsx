import React, { useCallback } from 'react';

import { TestRunResultType } from '../../../common/constants';
import { ITestRunType } from '../../../hooks/submissions/types';
import { toLowerCase } from '../../../utils/string-utils';
import ErrorIcon from '../../guidelines/icons/ErrorIcon';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import MemoryLimitIcon from '../../guidelines/icons/MemoryLimitIcon';
import RuntimeErrorIcon from '../../guidelines/icons/RuntimeErrorIcon';
import TickIcon from '../../guidelines/icons/TickIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import WrongAnswerIcon from '../../guidelines/icons/WrongAnswerIcon';

interface ITestRunIconProps {
    testRun: ITestRunType;
}

const TestRunIcon = ({ testRun }: ITestRunIconProps) => {
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

    return renderTestRunIcon();
};

export default TestRunIcon;
