import { useEffect, useState } from 'react';
import * as React from 'react';
import { useAuth } from '../../hooks/use-auth';
import { LinkButton } from '../../components/guidelines/buttons/Button';
import List from '../../components/guidelines/lists/List';

import styles from './PageNav.module.scss';

interface IRouteType {
    name: string;
    link: string;
    isPrimary: boolean;
}

const userRoutes = [
    { name: 'My tests', link: '/', isPrimary: true },
    { name: 'Log out', link: '/logout', isPrimary: false },
];

const anonymousRoutes = [
    { name: 'Login', link: '/login', isPrimary: false },
    { name: 'Register', link: '/register', isPrimary: true },
];

const PageNav = () => {
    const { user } = useAuth();
    const [ routes, setRoutes ] = useState(anonymousRoutes);

    useEffect(() => {
        setRoutes(user.isLoggedIn
            ? userRoutes
            : anonymousRoutes);
    }, [ user.isLoggedIn ]);

    const itemFunc = ({ name, link, isPrimary }: IRouteType) => {
        const type = isPrimary
            ? 'primary'
            : 'secondary';

        const btnClassName = styles.btn;

        return (
            <LinkButton to={link} text={name} type={type} className={btnClassName} />
        );
    };

    return (
        <nav>
            <List
              values={routes}
              itemFunc={itemFunc}
              orientation="horizontal"
              className={styles.listNav}
            />
        </nav>
    );
};

export default PageNav;
