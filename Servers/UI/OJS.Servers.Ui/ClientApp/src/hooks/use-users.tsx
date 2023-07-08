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
    isLoading: boolean;
}

const defaultState = { profile: { userName: '' } as IUserProfileType };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

type IUsersProviderProps = IHaveChildrenProps

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ profile, setProfile ] = useState(defaultState.profile);
    const { showError } = useNotifications();

    const {
        get: getProfileInfo,
        data: profileData,
    } = useHttp<null, IUserProfileType>({ url: getProfileInfoUrl });

    const getProfile = useCallback(async () => {
        setIsLoading(true);
        await getProfileInfo();
        setIsLoading(false);
    }, [ getProfileInfo ]);

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
            isLoading
        }),
        [ getProfile, profile, isLoading ],
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
