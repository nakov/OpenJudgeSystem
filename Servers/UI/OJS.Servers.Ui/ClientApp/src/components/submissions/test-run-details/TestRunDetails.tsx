import { BiInfoCircle, BiMemoryCard, BiTime } from 'react-icons/bi';

import { SubmissionResultType } from '../../../common/constants';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import concatClassNames from '../../../utils/class-names';
import { toLowerCase } from '../../../utils/string-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import Icon from '../../guidelines/icons/Icon';

import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
    trialTestsCount: number;
}

const getResultIsWrongAnswerResultType = (run: ITestRunDetailsType) => toLowerCase(run.resultType) !== SubmissionResultType.CorrectAnswer;

const TestRunDetails = ({ testRun, trialTestsCount }: ITestRunDetailsProps) => {
    const testRunHeadingClassName = concatClassNames(
        styles.testRunHeading,
        getResultIsWrongAnswerResultType(testRun)
            ? styles.wrongTestRunHeading
            : styles.correctTestRunHeading,
    );

    const testRunHeadingText = () => {
        const testRunText = `Test #${testRun.orderBy}`;

        if (testRun.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    };

    const handleTestClick = (e: any) => {
        const { target } = e;
        const h3Element = target.querySelector('h3');
        if (!h3Element) {
            return;
        }

        const { innerText } = h3Element;
        const numberOfTest = innerText.split('#')[1];
        const elementNumber = testRun.isTrialTest
            ? numberOfTest
            : parseInt(numberOfTest, 10) + trialTestsCount;
        const scrollToElement = document.querySelector(`#test-heading-${elementNumber - 1}`);
        if (!scrollToElement) { return; }

        const yCoordinate = scrollToElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
    };

    return (
        <button type="button" className={styles.testRun} onClick={handleTestClick}>
            <div className={styles.testRunContainer}>
                <span className={styles.testRunData}>
                    <Heading type={HeadingType.small} className={testRunHeadingClassName}>
                        { testRunHeadingText() }
                    </Heading>
                    <span className={styles.testRunDataParagraph}>
                        <Icon Component={BiTime} size={IconSize.Large} className={styles.iconPassiveColor} />
                        <span style={{ marginTop: '5px' }}>
                            {testRun.timeUsed / 1000}
                            {' '}
                            s.
                        </span>
                    </span>
                    <span className={styles.testRunDataParagraph}>
                        <Icon Component={BiMemoryCard} size={IconSize.Large} className={styles.iconPassiveColor} />
                        <span style={{ marginTop: '5px' }}>
                            {(testRun.memoryUsed / 1000000).toFixed(2)}
                            {' '}
                            MB
                        </span>
                    </span>
                    <Icon Component={BiInfoCircle} size={IconSize.Large} className={styles.iconActiveColor} />
                </span>
            </div>
        </button>
    );
};

export default TestRunDetails;
