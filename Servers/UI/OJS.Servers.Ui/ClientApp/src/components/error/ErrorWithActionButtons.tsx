import { Link } from 'react-router-dom';

import useTheme from '../../hooks/use-theme';
import isNilOrEmpty from '../../utils/check-utils';
import concatClassNames from '../../utils/class-names';
import Button, { LinkButton } from '../guidelines/buttons/Button';

import styles from './ErrorWithActionButtons.module.scss';

interface IErrorProps {
    message?: string;
    backToUrl?: string;
    backToText?: string;
}

const ErrorWithActionButtons = ({ message, backToUrl, backToText }: IErrorProps) => {
    const { getColorClassName, themeColors } = useTheme();

    return (
        <div className={concatClassNames(getColorClassName(themeColors.textColor), styles.errorWrapper)}>
            <div className={styles.message}>
                {
                    isNilOrEmpty(message)
                        ? 'Something went wrong, please try again!'
                        : JSON.stringify(message)
                }
            </div>
            <div className={styles.buttonsWrapper}>
                <LinkButton
                  to={`${isNilOrEmpty(backToUrl)
                      ? '/'
                      : backToUrl}`}
                  text={`${isNilOrEmpty(backToText)
                      ? 'Back to home'
                      : backToText}`}
                />
                {/* eslint-disable-next-line no-restricted-globals */}
                <Button onClick={() => location.reload()} text="reload page" />
            </div>
            <div className={styles.needHelpWrapper}>
                Need help? Contact us at:
                {' '}
                {' '}
                <Link to="https://softuni.bg/contacts">softuni.bg/contacts</Link>
            </div>
        </div>
    );
};

export default ErrorWithActionButtons;
