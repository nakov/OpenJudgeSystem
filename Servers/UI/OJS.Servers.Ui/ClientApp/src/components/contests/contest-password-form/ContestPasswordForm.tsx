import React, { useCallback, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { useCurrentContest } from '../../../hooks/use-current-contest';
import { usePageTitles } from '../../../hooks/use-page-titles';
import Form from '../../guidelines/forms/Form';
import FormControl, { FormControlType, IFormControlOnChangeValueType } from '../../guidelines/forms/FormControl';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestPasswordForm.module.scss';

interface IContestPasswordFormProps {
    id: number;
    isOfficial: boolean;
}

const ContestPasswordForm = ({ id, isOfficial }: IContestPasswordFormProps) => {
    const {
        state: {
            contest,
            contestPasswordError,
        },
        actions: { submitPassword },
    } = useCurrentContest();
    const [ passwordValue, setPasswordValue ] = useState<string>('');

    const { actions: { setPageTitle } } = usePageTitles();

    const passwordFieldName = 'contestPassword';

    const handleOnSubmitPassword = useCallback(async () => {
        await submitPassword({ id, isOfficial, password: passwordValue });
    }, [ id, isOfficial, passwordValue, submitPassword ]);

    const handleOnChangeUpdatePassword = useCallback(
        (value?: IFormControlOnChangeValueType) => {
            setPasswordValue(isNil(value)
                ? ''
                : value.toString());
        },
        [ setPasswordValue ],
    );

    const renderErrorSpan = useCallback(
        (message: string) => (
            <span className={styles.errorMessage}>{message}</span>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(contestPasswordError)) {
                const { detail } = contestPasswordError;
                return renderErrorSpan(detail);
            }

            return null;
        },
        [ contestPasswordError, renderErrorSpan ],
    );

    useEffect(
        () => {
            if (!isNil(contest)) {
                setPageTitle('Enter Contest Password');
            }
        },
        [ contest, setPageTitle ],
    );

    return (
        <Form
          className={styles.contestPasswordForm}
          onSubmit={() => handleOnSubmitPassword()}
          submitButtonClassName={styles.submitBtn}
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
              onChange={handleOnChangeUpdatePassword}
              value=""
            />
        </Form>
    );
};

export default ContestPasswordForm;
