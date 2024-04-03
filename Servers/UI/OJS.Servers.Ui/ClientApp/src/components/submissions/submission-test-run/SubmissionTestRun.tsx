import { useMemo, useState } from 'react';
import { BiMemoryCard } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';

import { ITestRun } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import Diff from '../../Diff';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';

import styles from './SubmissionTestRun.module.scss';

interface SubmissionTestRun {
    testRun: ITestRun;
}

const WRONG_ANSWER = 'WrongAnswer';
const CORRECT_ANSWER = 'CorrectAnswer';

const SubmissionTestRun = (props: SubmissionTestRun) => {
    const { testRun } = props;

    const [ testShowInput, setTestShowInput ] = useState<boolean>(false);
    console.log('test run => ', testRun);

    const {
        id,
        input,
        resultType,
        isTrialTest,
        memoryUsed,
        showInput,
        timeUsed,
        expectedOutputFragment,
        userOutputFragment,
    } = testRun;

    const { themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    const textIdColor = useMemo(() => {
        if (resultType === WRONG_ANSWER) {
            return 'red';
        } if (resultType === CORRECT_ANSWER) {
            return 'green';
        }
        return 'yellow';
    }, [ resultType ]);

    const onShowHideInputButtonClick = () => {
        setTestShowInput(!testShowInput);
    };
    return (
        <div className={`${backgroundColorClassName} ${textColorClassName} ${styles.testRunWrapper}`}>
            <div className={styles.testRunTitleWrapper}>
                <div className={styles.testNameButtonWrapper}>
                    <div style={{ color: textIdColor }}>
                        Test #
                        {id}
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
                    <span>
                        <BiMemoryCard size={20} color={themeColors.baseColor100} />
                        <span>
                            {(memoryUsed / 1000000).toFixed(2)}
                            {' '}
                            MB
                        </span>
                    </span>
                    <span>
                        <FaRegClock size={20} color={themeColors.baseColor100} />
                        <span>
                            {timeUsed / 1000}
                            {' '}
                            s.
                        </span>
                    </span>
                </div>
            </div>
            {testShowInput && (<div className={styles.inputWrapper} style={{ backgroundColor: themeColors.baseColor100 }}>{input}</div>)}
            {isTrialTest && resultType === WRONG_ANSWER && (
                <div className={styles.outputWrapper}>
                    <Diff expectedStr={expectedOutputFragment} actualStr={userOutputFragment} />
                </div>
            )}
        </div>
    );
};

export default SubmissionTestRun;
