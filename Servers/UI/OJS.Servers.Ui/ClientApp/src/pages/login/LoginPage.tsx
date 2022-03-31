import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from '../../components/guidelines/buttons/Button';
import FormControl from '../../components/guidelines/forms/FormControl';
import { useAuth } from '../../hooks/use-auth';

const LoginPage = () => {
    const { setUsername, setPassword, signIn, user } = useAuth();
    const history = useHistory();

    const onChangeUpdateUsername = useCallback((value: any) => {
        setUsername(value);
    }, [ setUsername ]);

    const onChangeUpdatePassword = useCallback((value: any) => {
        setPassword(value);
    }, [ setPassword ]);

    const submitLoginOnClick = useCallback(async () => {
        signIn();
    }, [ signIn ]);

    useEffect(() => {
        if (user.isLoggedIn) {
            history.push('/');
        }
    }, [ history, user.isLoggedIn ]);

    return (
        <>
            <form id="loginForm" action="">
                <FormControl id="username" name="Username" type="input" onChange={(value) => onChangeUpdateUsername(value)} value="" />
                <FormControl id="password" name="Password" type="password" onChange={(value) => onChangeUpdatePassword(value)} value="" />
                <FormControl id="auth-password-checkbox" name="Password" type="checkbox" value="false" />
                <Button id="auth-login-button" text="Login" type="primary" onClick={submitLoginOnClick} />
            </form>
        </>
    );
};

export default LoginPage;
