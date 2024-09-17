import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IUserInfoUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getAllParticipationsForUserUrl } from '../utils/urls';

import { useHttp } from './use-http';

interface IParticipationType {
        id: number;
        contestId: number;
        contestName: string;
        competeResult?: number;
        practiceResult?: number;
        contestCompeteMaximumPoints?: number;
        contestPracticeMaximumPoints?: number;
        registrationTime: Date;
}

interface IParticipationsContext {
    state: {
        userParticipations: IParticipationType[];
    };
    actions: {
        getUserParticipations: (username: string) => void;
    };
}

const defaultState = {};

const ParticipationsContext = createContext<IParticipationsContext>(defaultState as IParticipationsContext);

type IParticipationsProviderProps = IHaveChildrenProps

const ParticipationsProvider = ({ children }: IParticipationsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ userParticipations, setUserParticipations ] = useState<IParticipationType[]>([]);
    const [ getParticipationsForProfileUrlParam, setParticipationsForProfileUrUrlParam ] =
        useState<IUserInfoUrlParams | null>();

    const {
        get: getParticipationsForProfile,
        data: apiParticipationsForProfile,
    } = useHttp<IUserInfoUrlParams, IParticipationType[]>({
        url: getAllParticipationsForUserUrl,
        parameters: getParticipationsForProfileUrlParam,
    });

    const getUserParticipations = useCallback(
        (username: string) => {
            setParticipationsForProfileUrUrlParam({ username });
        },
        [],
    );

    useEffect(
        () => {
            if (isNil(getParticipationsForProfileUrlParam)) {
                return;
            }

            if (isLoading || !isNil(apiParticipationsForProfile)) {
                return;
            }

            setIsLoading(true);
            (async () => {
                await getParticipationsForProfile();
            })();

            setParticipationsForProfileUrUrlParam(null);
        },
        [ getParticipationsForProfileUrlParam, getParticipationsForProfile, isLoading, apiParticipationsForProfile ],
    );

    useEffect(
        () => {
            if (isNil(apiParticipationsForProfile)) {
                return;
            }

            setUserParticipations(apiParticipationsForProfile);
            setIsLoading(false);
        },
        [ apiParticipationsForProfile ],
    );

    const value = useMemo(
        () => ({
            state: {
                userParticipations,
                isLoading,
            },
            actions: { getUserParticipations },
        }),
        [ getUserParticipations, userParticipations, isLoading ],
    );

    return (
        <ParticipationsContext.Provider value={value}>
            {children}
        </ParticipationsContext.Provider>
    );
};

export type { IParticipationType };

export default ParticipationsProvider;
