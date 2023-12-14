import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

interface IUsersContext {
    state: {
        myProfile: IUserProfileType;
        isProfileInfoLoaded: boolean;
        isProfileInfoLoading: boolean;
        userProfileUsername: string;
    };
    actions: {
        getProfile: (username: string) => void;
        initiateRedirectionToUserProfile: (username: string, url: string) => void;
        clearUserProfileInformation: () => void;
    };
}

const defaultState = { state: { myProfile: { userName: '' } as IUserProfileType } };

const UsersContext = createContext<IUsersContext>(defaultState as IUsersContext);

type IUsersProviderProps = IHaveChildrenProps

const UsersProvider = ({ children }: IUsersProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ myProfile, setMyProfile ] = useState(defaultState.state.myProfile);
    const [ userProfileUsername, setUserProfileUsername ] = useState('');
    const [ getProfileInfoUrlUrlParam, setProfileInfoUrlParam ] =
        useState<IUserInfoUrlParams | null>();
    const { showError } = useNotifications();
    const navigate = useNavigate();

    const initiateRedirectionToUserProfile = useCallback(
        (profileUsername: string, url: string) => {
            setUserProfileUsername(profileUsername);

            navigate(url);
        },
        [ navigate ],
    );

    const {
        get: getProfileInfo,
        data: profileData,
        isSuccess,
    } = useHttp<IUserInfoUrlParams, IUserProfileType>({
        url: getProfileInfoUrl,
        parameters: getProfileInfoUrlUrlParam,
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
            if (isNil(profileData)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getProfileInfo();
            })();

            setProfileInfoUrlParam(null);
        },
        [ getProfileInfo, getProfileInfoUrlUrlParam, profileData ],
    );

    useEffect(
        () => {
            if (isNil(getProfileInfoUrlUrlParam)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getProfileInfo();
            })();

            setProfileInfoUrlParam(null);
        },
        [ getProfileInfo, getProfileInfoUrlUrlParam ],
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
                userProfileUsername,
            },
            actions: {
                getProfile,
                initiateRedirectionToUserProfile,
                clearUserProfileInformation,
            },
        }),
        [ getProfile, myProfile, isSuccess, isLoading, userProfileUsername, initiateRedirectionToUserProfile, clearUserProfileInformation ],
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
