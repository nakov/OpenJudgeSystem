import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../../components/common/Props';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { toLowerCase } from '../../utils/string-utils';
import NotFoundPage from '../not-found/NotFoundPage';

const routes = [
    '/login',
    '/register',
    '/logout',
    '/',
    '/profile',
    '/profile/:username',
    '/submissions',
    '/submissions/:id/details',
    '/contests/:slug',
    '/contests/:slug/:id',
    '/contests/:slug/:id/:participationType',
    '/contests/:slug/:id/:participationType/register',
    '/contests/:slug/:id/:participationType/results/:resultType',
    '/administration',
    '/submissions/retest/:id',
    '/contest/problems/:id',
    '/contest/edit/:id',
    '/tests/edit/:id',
    '/search',
];

const isPathInAllowedRoutes = (pathname: string) => {
    const exactPathname = decodeURI(toLowerCase(pathname.split('?')[0]));
    const matchingRoute = routes.find((route) => {
        const regexPattern = route
            .replace(/:id/g, '([1-9]\\d{0,8}|0|2147483647)')
            .replace(/:username/g, '([^/]+)')
            .replace(/:participationType/g, '([a-zA-Z]+)')
            .replace(/:slug/g, '([\\p{L}\\p{Nd}]+(?:-[\\p{L}\\p{Nd}]+)*)')
            .replace(/:resultType/g, '[a-zA-Z]+');
        return new RegExp(`^${regexPattern}$`, 'u').test(exactPathname);
    });

    return !!matchingRoute;
};

const Page = ({ children }: IHaveChildrenProps) => {
    const params = useParams();
    const { actions: { setParams } } = useRouteUrlParams();

    useEffect(
        () => {
            if (isNil(params)) {
                return;
            }

            setParams(params);
        },
        [ params, setParams ],
    );

    return children;
};

const asPage = (ComponentToWrap: FC) => (props: any) => {
    if (!isPathInAllowedRoutes(window.location.pathname)) {
        return <NotFoundPage />;
    }

    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
        <Page>
            <ComponentToWrap {...props} />
        </Page>
    );
};

export default Page;

export {
    asPage,
};
