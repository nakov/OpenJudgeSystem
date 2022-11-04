import * as React from 'react';
import { useCallback, useState } from 'react';
import { isNil } from 'lodash';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import FormControl, { FormControlType } from '../../guidelines/forms/FormControl';
import Form from '../../guidelines/forms/Form';
import styles from './ContestPasswordForm.module.scss';
import concatClassNames from '../../../utils/class-names';

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

    const handleOnChangeUpdatePassword = useCallback((value: string) => {
        setPasswordValue(value);
    }, [ setPasswordValue ]);

    const errorMessageClass = 'errorMessage';
    const errorMessageClassName = concatClassNames(styles.errorMessage, errorMessageClass);

    const renderErrorMessage = useCallback(
        () => (!isNil(submitContestPasswordErrorMessage)
            ? <span className={errorMessageClassName}>{submitContestPasswordErrorMessage}</span>
            : null),
        [ submitContestPasswordErrorMessage, errorMessageClassName ],
    );

    return (
        <Form
          id='form'
          className={styles.contestPasswordForm}
              onSubmit={() => {
                  handleOnSubmitPassword();
              }}
        >
            <header className={styles.formHeader}>
                <Heading type={HeadingType.primary}>Enter contest password</Heading>
                <Heading type={HeadingType.secondary}>{contest?.name}</Heading>
                { renderErrorMessage() }
            </header>
            <FormControl
              id={passwordFieldName.toLowerCase()}
              name={passwordFieldName}
              labelText="Password"
              type={FormControlType.password}
              onChange={(value) => handleOnChangeUpdatePassword(isNil(value)
                  ? ''
                  : value.toString())}
              value=""
            />
        </Form>
    );
};

export default ContestPasswordForm;
