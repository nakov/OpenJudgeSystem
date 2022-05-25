import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { IHaveChildrenProps } from '../components/common/Props';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { useNotifications } from './use-notifications';
import { useUrls } from './use-urls';

interface IUserProfileType {
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    email: string
}

interface IUsersContext {
    profile: IUserProfileType,
    getProfile: () => Promise<void>
}

const defaultState = { profile: { userName: '' } as IUserProfileType };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

interface IUsersProviderProps extends IHaveChildrenProps {}

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ profile, setProfile ] = useState(defaultState.profile);
    const { showError } = useNotifications();

    const { getProfileInfoUrl } = useUrls();

    const {
        get: getProfileInfoRequest,
        data: getProfileInfoData,
    } = useHttp(getProfileInfoUrl);

    const getProfile = useCallback(async () => {
        startLoading();
        await getProfileInfoRequest();
        stopLoading();
    }, [ getProfileInfoRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(getProfileInfoData)) {
            return;
        }

        setProfile(getProfileInfoData as IUserProfileType);

        // showError({ message: 'Could not retrieve profile info.' } as INotificationType);
    }, [ getProfileInfoData, showError ]);

    const value = { profile, getProfile };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};

const useUsers = () => useContext(UsersContext);

export {
    useUsers,
};

export type { IUserProfileType };

export default UsersProvider;
