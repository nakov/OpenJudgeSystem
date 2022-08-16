import * as React from 'react';
import { useCallback, useState } from 'react';
import { isNil } from 'lodash';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import FormControl, { FormControlType } from '../../guidelines/forms/FormControl';
import Form from '../../guidelines/forms/Form';
import styles from './ContestPasswordForm.module.scss';

interface IContestPasswordFormProps {
    id: number;
    isOfficial: boolean;
}

const ContestPasswordForm = ({ id, isOfficial }: IContestPasswordFormProps) => {
    const {
        state: {
            contest,
            submitContestPasswordErrorMessage,
        },
        actions: { submitPassword },
    } = useCurrentContest();
    const [ passwordValue, setPasswordValue ] = useState<string>('');

    const passwordFieldName = 'contestPassword';

    const handleOnSubmitPassword = useCallback(async () => {
        await submitPassword({ id, isOfficial, password: passwordValue });
    }, [ id, isOfficial, passwordValue, submitPassword ]);

    const handleOnChangeUpdatePassword = useCallback((value: any) => {
        setPasswordValue(value);
    }, [ setPasswordValue ]);

    const renderErrorMessage = useCallback(
        () => (!isNil(submitContestPasswordErrorMessage)
            ? <span className={styles.errorMessage}>{submitContestPasswordErrorMessage}</span>
            : null),
        [ submitContestPasswordErrorMessage ],
    );

    return (
        <Form
          className={styles.contestPasswordForm}
          onSubmit={() => {
              handleOnSubmitPassword();
          }}
        >
            <header className={styles.formHeader}>
                <Heading type={HeadingType.primary}>Enter contest password</Heading>
                <Heading type={HeadingType.secondary} className={styles.contestNameHeading}>{contest?.name}</Heading>
                { renderErrorMessage() }
            </header>
            <FormControl
              id={passwordFieldName.toLowerCase()}
              name={passwordFieldName}
              labelText="Password"
              type={FormControlType.password}
              onChange={(value) => handleOnChangeUpdatePassword(value)}
              value=""
            />
        </Form>
    );
};

export default ContestPasswordForm;
