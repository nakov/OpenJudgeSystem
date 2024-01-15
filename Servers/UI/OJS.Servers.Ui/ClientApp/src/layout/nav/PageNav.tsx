import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Button, ButtonType } from '../../components/guidelines/buttons/Button';
import List, { Orientation } from '../../components/guidelines/lists/List';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';

import styles from './PageNav.module.scss';

interface IRouteType {
    name: string;
    link: string;
    isPrimary: boolean;
    id: string;
}

const userRoutes = [
    { id: 'nav-my-profile-link', name: 'My Profile', link: '/profile', isPrimary: true },
    { id: 'nav-logout-link', name: 'Log out', link: '/logout', isPrimary: false },
];

const anonymousRoutes = [
    { name: 'Login', link: '/login', isPrimary: false, id: 'anonymous-login-link' },
    { name: 'Register', link: '/register', isPrimary: true, id: 'anonymous-register-link' },
];
const PageNav = () => {
    const { isLoggedIn } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const [ routes, setRoutes ] = useState(anonymousRoutes);
    const navigate = useNavigate();

    useEffect(() => {
        setRoutes(isLoggedIn
            ? userRoutes
            : anonymousRoutes);
    }, [ isLoggedIn ]);

    const itemFunc = ({ name, link, isPrimary, id }: IRouteType) => {
        const type = isPrimary
            ? ButtonType.primary
            : ButtonType.secondary;

        const handleButtonClick = () => {
            navigate(link);
        };

        return (
            <Button onClick={handleButtonClick} id={id} text={name} type={type} className={styles.btn} />
        );
    };

    return (
        <nav className={styles.navigation}>
            <List
              values={routes}
              itemFunc={itemFunc}
              orientation={Orientation.horizontal}
              className={styles.listNav}
            />
        </nav>
    );
};

export default PageNav;
