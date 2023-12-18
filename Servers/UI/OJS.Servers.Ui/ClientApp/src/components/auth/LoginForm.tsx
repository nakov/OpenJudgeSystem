import React, { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import {
    EmptyPasswordErrorMessage,
    EmptyUsernameErrorMessage,
    PasswordLengthErrorMessage,
    UsernameFormatErrorMessage, UsernameLengthErrorMessage,
} from '../../common/constants';
import { useAuth } from '../../hooks/use-auth';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { LinkButton, LinkButtonType } from '../guidelines/buttons/Button';
import Form from '../guidelines/forms/Form';
import FormControl, { FormControlType, IFormControlOnChangeValueType } from '../guidelines/forms/FormControl';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import SpinningLoader from '../guidelines/spinning-loader/SpinningLoader';

import styles from './LoginForm.module.scss';

const LoginPage = () => {
    const {
        state: {
            loginErrorMessage,
            isLoggingIn,
            isLoggedIn,
        },
        actions: {
            setUsername,
            setPassword,
            signIn,
            setLoginErrorMessage,
        },
    } = useAuth();

    const [ usernameFormError, setUsernameFormError ] = useState('');
    const [ passwordFormError, setPasswordFormError ] = useState('');

    const usernameFieldName = 'Username';
    const passwordFieldName = 'Password';

    const handleOnChangeUpdateUsername = useCallback((value?: IFormControlOnChangeValueType) => {
        if (isEmpty(value)) {
            setUsernameFormError(EmptyUsernameErrorMessage);
        } else if (!isNil(value) && (value.length < 5 || value.length > 32)) {
            setUsernameFormError(UsernameLengthErrorMessage);
        } else {
            const regex = /^[a-zA-Z][a-zA-Z0-9._]{3,30}[a-zA-Z0-9]$/;
            if (!regex.test(value as string)) {
                setUsernameFormError(UsernameFormatErrorMessage);
            } else {
                setUsernameFormError('');
            }
        }

        setUsername(isNil(value)
            ? ''
            : value as string);
    }, [ setUsername ]);

    const handleOnChangeUpdatePassword = useCallback((value?: IFormControlOnChangeValueType) => {
        if (isEmpty(value)) {
            setPasswordFormError(EmptyPasswordErrorMessage);
        } else if (!isNil(value) && value.length < 6) {
            setPasswordFormError(PasswordLengthErrorMessage);
        } else {
            setPasswordFormError('');
        }

        setPassword(isNil(value)
            ? ''
            : value as string);
    }, [ setPassword ]);

    useEffect(() => {
        if (!isEmpty(usernameFormError)) {
            setLoginErrorMessage(usernameFormError);
            return;
        }

        if (!isEmpty(passwordFormError)) {
            setLoginErrorMessage(passwordFormError);
            return;
        }

        setLoginErrorMessage('');
    }, [ usernameFormError, passwordFormError, setLoginErrorMessage ]);

    const handleLoginClick = useCallback(async () => {
        await signIn();
    }, [ signIn ]);

    const renderLoginErrorMessage = useCallback(
        () => (!isNil(loginErrorMessage)
            ? <span className={styles.errorMessage}>{loginErrorMessage}</span>
            : null),
        [ loginErrorMessage ],
    );

    const renderLoginForm = useCallback(
        (shouldHideButton : boolean) => (
            <Form
              className={styles.loginForm}
              onSubmit={() => handleLoginClick()}
              submitText="Login"
              hideFormButton={shouldHideButton}
            >
                <header className={styles.loginFormHeader}>
                    <Heading type={HeadingType.primary}>Login</Heading>
                    <span className={styles.registerHeader}>
                        { 'You don\'t have an account yet? '}
                        <LinkButton
                          to="/register"
                          type={LinkButtonType.plain}
                          className={styles.loginFormLink}
                        >
                            Register
                        </LinkButton>
                    </span>
                    { renderLoginErrorMessage() }
                </header>
                <FormControl
                  id={usernameFieldName.toLowerCase()}
                  name={usernameFieldName}
                  labelText={usernameFieldName}
                  type={FormControlType.input}
                  onChange={handleOnChangeUpdateUsername}
                  value=""
                />
                <FormControl
                  id={passwordFieldName.toLowerCase()}
                  name={passwordFieldName}
                  labelText={passwordFieldName}
                  type={FormControlType.password}
                  onChange={handleOnChangeUpdatePassword}
                  value=""
                />
                <div className={styles.loginFormControls}>
                    <FormControl
                      id="auth-password-checkbox"
                      name="RememberMe"
                      labelText="Remember Me"
                      type={FormControlType.checkbox}
                    />
                    <div>
                        <LinkButton
                          type={LinkButtonType.plain}
                          to="/Account/ExternalNotify"
                          className={styles.loginFormLink}
                        >
                            Forgotten password
                        </LinkButton>
                    </div>
                </div>
                {isLoggingIn && (
                    <div className={styles.loginFormLoader}>
                        <div style={{ ...flexCenterObjectStyles }}>
                            <SpinningLoader />
                        </div>
                    </div>
                )}
            </Form>
        ),
        [ handleLoginClick, handleOnChangeUpdatePassword, handleOnChangeUpdateUsername, isLoggingIn, renderLoginErrorMessage ],
    );

    return (
        isLoggingIn || isLoggedIn
            ? renderLoginForm(true)
            : renderLoginForm(false)
    );
};

export default LoginPage;
