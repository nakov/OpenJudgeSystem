import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../components/common/Props';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { getParticipationsForProfileUrl } from '../utils/urls';

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

interface IParticipationsProviderProps extends IHaveChildrenProps {}

const ParticipationsProvider = ({ children }: IParticipationsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ areUserParticipationsRetrieved, setAreUserParticipationsRetrieved ] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ userParticipations, setUserParticipations ] = useState<IParticipationType[]>([]);
    const {
        get: getParticipationsForProfileRequest,
        data: getParticipationsForProfileData,
    } = useHttp(getParticipationsForProfileUrl);

    const getUserParticipations = useCallback(async () => {
        startLoading();
        await getParticipationsForProfileRequest();
        stopLoading();
    }, [ getParticipationsForProfileRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getParticipationsForProfileData != null) {
            console.log(getParticipationsForProfileData);
            setUserParticipations(getParticipationsForProfileData as IParticipationType[]);
            setAreUserParticipationsRetrieved(true);
        }
    }, [ getParticipationsForProfileData ]);

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
