import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IUserInfoUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getProfileInfoUrl } from '../utils/urls';

import { useHttp } from './use-http';

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
        isGetProfileQueryInitiated : boolean;
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
    const [ isGetProfileQueryInitiated, setIsGetProfileQueryInitiated ] = useState(false);
    const [ isProfileInfoLoaded, setIsProfileInfoLoaded ] = useState(false);
    const [ myProfile, setMyProfile ] = useState(defaultState.state.myProfile);
    const [ profileInfoUrlUrlParam, setProfileInfoUrlParam ] =
        useState<IUserInfoUrlParams | null>();

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
            setIsGetProfileQueryInitiated(true);
            setProfileInfoUrlParam({ username });
        },
        [],
    );

    const clearUserProfileInformation = useCallback(
        () => {
            setIsLoading(false);
            setIsGetProfileQueryInitiated(false);
            setIsProfileInfoLoaded(false);
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

            setMyProfile(profileData);

            setProfileInfoUrlParam(null);
        },
        [ profileData ],
    );

    useEffect(
        () => {
            if (!isNil(profileData) && isSuccess && !isEmpty(myProfile.userName)) {
                setIsLoading(false);
            }
        },
        [ profileData, myProfile, isSuccess ],
    );

    useEffect(
        () => {
            if (isSuccess && isEmpty(myProfile.userName)) {
                setIsLoading(false);
            }
        },
        [ profileData, myProfile, isSuccess ],
    );

    useEffect(
        () => {
            if (isSuccess) {
                setIsProfileInfoLoaded(true);
            }
        },
        [ isSuccess ],
    );

    const value = useMemo(
        () => ({
            state: {
                myProfile,
                isProfileInfoLoaded,
                isProfileInfoLoading: isLoading,
                isGetProfileQueryInitiated,
            },
            actions: {
                getProfile,
                clearUserProfileInformation,
            },
        }),
        [ myProfile, isProfileInfoLoaded, isLoading, isGetProfileQueryInitiated, getProfile, clearUserProfileInformation ],
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
