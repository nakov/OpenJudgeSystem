import { useSelector } from 'react-redux';

import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';

const HeaderGreeting = () => {
    const { isLoggedIn, internalUser: user } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const className = '';

    const text = isLoggedIn
        ? `Hello, ${user.userName}`
        : '';

    return (
        <p id="greetingMessage" className={className}>{text}</p>
    );
};

export default HeaderGreeting;
