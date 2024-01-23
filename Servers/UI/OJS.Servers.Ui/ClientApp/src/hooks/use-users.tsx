import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IUserInfoUrlParams } from '../common/url-types';
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
    city?: string;
    age?: number;
}

interface IUsersContext {
    state: {
        myProfile: IUserProfileType;
        isProfileInfoLoaded: boolean;
        isProfileInfoLoading: boolean;
    };
    actions: {
        getProfile: (username: string) => void;
        clearUserProfileInformation: () => void;
    };
}

const defaultState = { state: { myProfile: { userName: '' } as IUserProfileType } };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

type IUsersProviderProps = IHaveChildrenProps

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ myProfile, setMyProfile ] = useState(defaultState.state.myProfile);
    const [ profileInfoUrlUrlParam, setProfileInfoUrlParam ] =
        useState<IUserInfoUrlParams | null>();
    const { showError } = useNotifications();

    const {
        get: getProfileInfo,
        data: profileData,
        isSuccess,
    } = useHttp<IUserInfoUrlParams, IUserProfileType>({
        url: getProfileInfoUrl,
        parameters: profileInfoUrlUrlParam,
    });

    const getProfile = useCallback(
        (username: string) => {
            setProfileInfoUrlParam({ username });
        },
        [],
    );

    const clearUserProfileInformation = useCallback(
        () => {
            setMyProfile(defaultState.state.myProfile);
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(profileInfoUrlUrlParam)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getProfileInfo();
            })();

            setProfileInfoUrlParam(null);
        },
        [ getProfileInfo, profileInfoUrlUrlParam ],
    );

    useEffect(
        () => {
            if (isNil(profileData)) {
                return;
            }

            setIsLoading(false);
            setMyProfile(profileData);

            setProfileInfoUrlParam(null);
        },
        [ profileData, showError ],
    );

    const value = useMemo(
        () => ({
            state: {
                myProfile,
                isProfileInfoLoaded: isSuccess,
                isProfileInfoLoading: isLoading,
            },
            actions: {
                getProfile,
                clearUserProfileInformation,
            },
        }),
        [ getProfile, myProfile, isSuccess, isLoading, clearUserProfileInformation ],
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
