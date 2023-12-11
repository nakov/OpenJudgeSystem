import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

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
        },
    } = useAuth();
    const usernameFieldName = 'Username';
    const passwordFieldName = 'Password';

    const handleOnChangeUpdateUsername = useCallback((value?: IFormControlOnChangeValueType) => {
        setUsername(isNil(value)
            ? ''
            : value as string);
    }, [ setUsername ]);

    const handleOnChangeUpdatePassword = useCallback((value?: IFormControlOnChangeValueType) => {
        setPassword(isNil(value)
            ? ''
            : value as string);
    }, [ setPassword ]);

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
