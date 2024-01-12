import React from 'react';
import { useSelector } from 'react-redux';

import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';

const HeaderGreeting = () => {
    const { isLoggedIn, internalUser: user } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const className = '';

    const text = isLoggedIn
        ? `Hello, ${user.username}`
        : '';

    return (
        <p id="greetingMessage" className={className}>{text}</p>
    );
};

export default HeaderGreeting;
