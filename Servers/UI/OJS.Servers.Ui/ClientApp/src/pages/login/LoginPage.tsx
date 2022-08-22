import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormControl, { FormControlType } from '../../components/guidelines/forms/FormControl';
import { useAuth } from '../../hooks/use-auth';
import Form from '../../components/guidelines/forms/Form';

const LoginPage = () => {
    const { setUsername, setPassword, signIn, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onChangeUpdateUsername = useCallback((value: any) => {
        setUsername(value);
    }, [ setUsername ]);

    const onChangeUpdatePassword = useCallback((value: any) => {
        setPassword(value);
    }, [ setPassword ]);

    const handleLoginClick = useCallback(async () => {
        await signIn();
    }, [ signIn ]);

    useEffect(() => {
        const { isLoggedIn } = user;

        if (isLoggedIn) {
            // @ts-ignore
            const origin = location.state?.from?.pathname || '/';

            navigate(origin);
        }
    }, [ location, navigate, user ]);

    return (
        <>
            <Form
              onSubmit={() => handleLoginClick()}
              submitText="Login"
            >
                <FormControl
                  id="username"
                  name="Username"
                  type={FormControlType.input}
                  onChange={(value) => onChangeUpdateUsername(value)}
                  value=""
                />
                <FormControl
                  id="password"
                  name="Password"
                  type={FormControlType.password}
                  onChange={(value) => onChangeUpdatePassword(value)}
                  value=""
                />
                <FormControl
                  id="auth-password-checkbox"
                  name="Password"
                  type={FormControlType.checkbox}
                  value="false"
                />
            </Form>
        </>
    );
};

export default LoginPage;
