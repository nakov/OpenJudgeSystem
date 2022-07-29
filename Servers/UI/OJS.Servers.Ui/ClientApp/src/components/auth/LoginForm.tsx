import * as React from 'react';
import { useCallback } from 'react';
import { isNil } from 'lodash';
import { useAuth } from '../../hooks/use-auth';
import FormControl, { FormControlType } from '../guidelines/forms/FormControl';
import Form from '../guidelines/forms/Form';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import { LinkButton, LinkButtonType } from '../guidelines/buttons/Button';
import { IDENTITY_CONFIG } from '../../identity-config';
import styles from './LoginForm.module.scss';

const LoginPage = () => {
    const { setUsername, setPassword, signIn, loginErrorMessage } = useAuth();
    const usernameFieldName = 'Username';
    const passwordFieldName = 'Password';

    const onChangeUpdateUsername = useCallback((value: any) => {
        setUsername(value);
    }, [ setUsername ]);

    const onChangeUpdatePassword = useCallback((value: any) => {
        setPassword(value);
    }, [ setPassword ]);

    const handleLoginClick = useCallback(async () => {
        await signIn();
    }, [ signIn ]);

    const renderLoginErrorMessage = useCallback(() => {
        if (isNil(loginErrorMessage)) {
            return null;
        }

        return (<span className={styles.errorMessage}>{loginErrorMessage}</span>);
    }, [ loginErrorMessage ]);
    return (
        <Form
          className={styles.loginForm}
          onSubmit={() => {
              handleLoginClick();
          }}
          submitText="Login"
        >
            <header className={styles.loginFormHeader}>
                <Heading type={HeadingType.primary}>Login</Heading>
                <span className={styles.registerHeader}>
                    { 'You don\'t have an account yet? '}
                    <LinkButton
                      to={IDENTITY_CONFIG.register}
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
              onChange={(value) => onChangeUpdateUsername(value)}
              value=""
            />
            <FormControl
              id={passwordFieldName.toLowerCase()}
              name={passwordFieldName}
              labelText={passwordFieldName}
              labelClassName={styles.floatingLabel}
              type={FormControlType.password}
              onChange={(value) => onChangeUpdatePassword(value)}
              value=""
            />
            <div className={styles.loginFormControls}>
                <FormControl
                  id="auth-password-checkbox"
                  name="RememberMe"
                  labelText="Remember Me"
                  containerClassName={styles.flexDirectionRow}
                  labelClassName={styles.rememberMeLabel}
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
        </Form>
    );
};

export default LoginPage;
