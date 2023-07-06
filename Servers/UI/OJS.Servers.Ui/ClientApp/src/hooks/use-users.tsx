import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../components/common/Props';
import { getProfileInfoUrl } from '../utils/urls';

import { useHttp } from './use-http';
import { useNotifications } from './use-notifications';

interface IUserProfileType {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    isGetUserLoading: boolean;
}

interface IUsersContext {
    profile: IUserProfileType;
    getProfile: () => Promise<void>;
}

const defaultState = { profile: { userName: '' } as IUserProfileType };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

type IUsersProviderProps = IHaveChildrenProps

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const [ profile, setProfile ] = useState(defaultState.profile);
    const { showError } = useNotifications();

    const {
        isLoading: isGetUserLoading,
        get: getProfileInfo,
        data: profileData,
    } = useHttp<null, IUserProfileType>({ url: getProfileInfoUrl });

    const getProfile = useCallback(async () => await getProfileInfo(), [ getProfileInfo ]);

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
            isGetUserLoading
        }),
        [ getProfile, profile, isGetUserLoading ],
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
