import { FC } from 'react';

import ILooseObject from '../../components/common/LooseObject';
import HomePage from '../../pages/home/HomePage';
import LoginPage from '../../pages/login/LoginPage';

type RouteType = {
    path: string,
    component: FC,
};

const routes: RouteType[] = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/login',
        component: LoginPage,
    },
];

const getRoutes = () => [ ...routes ];
const getRoutesMap = () => {
    const routesMap: ILooseObject = {};

    routes.forEach(({ path, component }) => {
        routesMap[path] = { path, component };
    });

    return routesMap;
};

const useRoutes = () => ({
    getRoutes,
    getRoutesMap,
});

export default useRoutes;
