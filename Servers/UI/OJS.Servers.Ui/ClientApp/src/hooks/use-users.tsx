import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../components/common/Props';
import { getProfileInfoUrl } from '../utils/urls';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useNotifications } from './use-notifications';

interface IUserProfileType {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface IUsersContext {
    profile: IUserProfileType;
    getProfile: () => Promise<void>;
}

const defaultState = { profile: { userName: '' } as IUserProfileType };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

type IUsersProviderProps = IHaveChildrenProps

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ profile, setProfile ] = useState(defaultState.profile);
    const { showError } = useNotifications();

    const {
        get: getProfileInfo,
        data: profileData,
    } = useHttp<null, IUserProfileType>({ url: getProfileInfoUrl });

    const getProfile = useCallback(async () => {
        startLoading();
        await getProfileInfo();
        stopLoading();
    }, [ getProfileInfo, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(profileData)) {
            return;
        }

        setProfile(profileData);

        // showError({ message: 'Could not retrieve profile info.' } as INotificationType);
    }, [ profileData, showError ]);

    const value = useMemo(
        () => ({
            profile,
            getProfile,
        }),
        [ getProfile, profile ],
    );

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
