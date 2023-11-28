import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

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
    areUserParticipationsRetrieved: boolean;
    userParticipations: IParticipationType[];
    getUserParticipations: () => Promise<void>;
}

const defaultState = {};

const ParticipationsContext = createContext<IParticipationsContext>(defaultState as IParticipationsContext);

type IParticipationsProviderProps = IHaveChildrenProps

const ParticipationsProvider = ({ children }: IParticipationsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ areUserParticipationsRetrieved, setAreUserParticipationsRetrieved ] = useState<boolean>(false);
    const [ userParticipations, setUserParticipations ] = useState<IParticipationType[]>([]);

    const {
        get: getParticipationsForProfile,
        data: apiParticipationsForProfile,
    } = useHttp<null, IParticipationType[]>({ url: getAllParticipationsForUserUrl });

    const getUserParticipations = useCallback(async () => {
        setIsLoading(true);
        await getParticipationsForProfile();
        setIsLoading(false);
    }, [ getParticipationsForProfile ]);

    useEffect(() => {
        if (isNil(apiParticipationsForProfile)) {
            return;
        }

        setUserParticipations(apiParticipationsForProfile);
        setAreUserParticipationsRetrieved(true);
    }, [ apiParticipationsForProfile ]);

    const value = useMemo(
        () => ({
            areUserParticipationsRetrieved,
            userParticipations,
            getUserParticipations,
            isLoading,
        }),
        [ areUserParticipationsRetrieved, getUserParticipations, userParticipations, isLoading ],
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
