import React from 'react';

import { useAuth } from '../../hooks/use-auth';

const HeaderGreeting = () => {
    const { state: { user, isLoggedIn } } = useAuth();

    const className = '';

    const text = isLoggedIn
        ? `Hello, ${user.username}`
        : '';

    return (
        <p id="greetingMessage" className={className}>{text}</p>
    );
};

export default HeaderGreeting;
