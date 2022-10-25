import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

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
    areUserParticipationsRetrieved: boolean;
    userParticipations: IParticipationType[];
    getUserParticipations: () => Promise<void>;
}

const defaultState = {};

const ParticipationsContext = createContext<IParticipationsContext>(defaultState as IParticipationsContext);

type IParticipationsProviderProps = IHaveChildrenProps

const ParticipationsProvider = ({ children }: IParticipationsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ areUserParticipationsRetrieved, setAreUserParticipationsRetrieved ] = useState<boolean>(false);
    const [ userParticipations, setUserParticipations ] = useState<IParticipationType[]>([]);

    const { getParticipationsForProfileUrl } = useUrls();
    const {
        get: getParticipationsForProfile,
        data: apiParticipationsForProfile,
    } = useHttp(getParticipationsForProfileUrl);

    const getUserParticipations = useCallback(async () => {
        startLoading();
        await getParticipationsForProfile();
        stopLoading();
    }, [ getParticipationsForProfile, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(apiParticipationsForProfile)) {
            return;
        }

        setUserParticipations(apiParticipationsForProfile as IParticipationType[]);
        setAreUserParticipationsRetrieved(true);
    }, [ apiParticipationsForProfile ]);

    const value = useMemo(
        () => ({
            areUserParticipationsRetrieved,
            userParticipations,
            getUserParticipations,
        }),
        [ areUserParticipationsRetrieved, getUserParticipations, userParticipations ],
    );

    return (
        <ParticipationsContext.Provider value={value}>
            {children}
        </ParticipationsContext.Provider>
    );
};

const useParticipations = () => useContext(ParticipationsContext);

export {
    useParticipations,
};

export type { IParticipationType };

export default ParticipationsProvider;
