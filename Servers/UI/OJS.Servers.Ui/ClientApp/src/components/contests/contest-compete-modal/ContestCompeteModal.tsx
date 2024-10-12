import useTheme from '../../../hooks/use-theme';
import concatClassNames from '../../../utils/class-names';
import { timeToWords } from '../../../utils/dates';
import Button, { ButtonType } from '../../guidelines/buttons/Button';
import ContestButton from '../contest-button/ContestButton';

import styles from './ContestCompeteModal.module.scss';

interface IContestCompeteModalProps {
    examName: string;
    time: string;
    problemsCount: number;
    onAccept: () => void;
    onDecline: () => void;
}

const ContestCompeteModal = (props: IContestCompeteModalProps) => {
    const { examName, time, problemsCount, onAccept, onDecline } = props;

    const { isDarkMode, themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const modalBodyClassName = concatClassNames(
        getColorClassName(isDarkMode
            ? themeColors.baseColor200
            : themeColors.baseColor100),
        styles.modalBody,
    );

    return (
        <div className={concatClassNames(styles.modalWrapper, textColorClassName)}>
            <div className={styles.modalTitle}>
                Starting now
                <b>
                    {' '}
                    you will have
                    {' '}
                    {timeToWords(time)}
                    {' '}
                </b>
                to complete the contest
                {' '}
                {examName}
            </div>
            <div className={modalBodyClassName}>
                <div>Your time will start counting down when you press the &apos;Compete&apos; button.</div>
                <div>
                    In the case of unexpected problems (turning off your computer, exiting the page/system, internet connection failure),
                    {' '}
                    <b>the time lost will not be restored. </b>
                    When time runs out, you will not be able to compete in this competition again.
                </div>
                <div>
                    When you click the &apos;Compete&apos; button,
                    <b>
                        {' '}
                        {problemsCount}
                        {' '}
                        random problems, one of each type, will be generated
                        {' '}
                    </b>
                    for you.
                </div>
                <div>
                    <b>Are you sure you want to start the contest now?</b>
                </div>
                <div className={styles.buttonsWrapper}>
                    <ContestButton
                      className={styles.contestButton}
                      isDisabled={false}
                      id={1}
                      onClick={onAccept}
                      name={examName}
                      isCompete
                    />
                    <Button
                      type={ButtonType.neutral}
                      text="cancel"
                      onClick={onDecline}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContestCompeteModal;
