import * as React from 'react';

import { useAuth } from '../../hooks/use-auth';

const HeaderGreeting = () => {
    const { actions: { getUser } } = useAuth();
    const user = getUser();

    // const className = user.isLoggedIn
    //     ? ''
    //     : styles.hidden;
    const className = '';

    const text = user.isLoggedIn
        ? `Hello, ${user.username}`
        : '';

    return (
        <p id="greetingMessage" className={className}>{text}</p>
    );
};

export default HeaderGreeting;
