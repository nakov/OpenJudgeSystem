import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import FormControl from '../../components/guidelines/forms/FormControl';
import { useAuth } from '../../hooks/use-auth';
import Form from '../../components/guidelines/forms/Form';

const LoginPage = () => {
    const { setUsername, setPassword, signIn, user } = useAuth();
    const history = useHistory();

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
            history.push('/');
        }
    }, [ history, user ]);

    return (
        <>
            <Form
              onSubmit={() => handleLoginClick()}
              submitText="Login"
            >
                <FormControl name="Username" type="input" onChange={(value) => onChangeUpdateUsername(value)} value="" />
                <FormControl
                  name="Password"
                  type="password"
                  onChange={(value) => onChangeUpdatePassword(value)}
                  value=""
                />
                <FormControl name="Password" type="checkbox" value="false" />
            </Form>
        </>
    );
};

export default LoginPage;
