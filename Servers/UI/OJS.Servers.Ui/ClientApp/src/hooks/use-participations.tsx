import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { IHaveChildrenProps } from '../components/common/Props';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';

interface IParticipationType {
    id: number,
    contestId: number,
    contestName: string,
    competeResult?: number,
    practiceResult?: number,
    contestCompeteMaximumPoints?: number,
    contestPracticeMaximumPoints?: number,
    registrationTime: Date
}

interface IParticipationsContext {
    areUserParticipationsRetrieved: boolean,
    userParticipations: IParticipationType[]
    getUserParticipations: () => Promise<void>
}

const defaultState = {};

const ParticipationsContext = createContext<IParticipationsContext>(defaultState as IParticipationsContext);

interface IParticipationsProviderProps extends IHaveChildrenProps {
}

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

    const value = {
        areUserParticipationsRetrieved,
        userParticipations,
        getUserParticipations,
    };

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
