import React, {
    createContext, useCallback,
    useContext,
    useEffect, useState,
} from 'react';

import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { useHttp } from './use-http';
import { getSessionIdUrl } from '../utils/urls';
import { useServices } from './use-services';

interface ISessionContext {
    getSessionId(): Promise<void>,
    isSessionLoaded: boolean,
}

const defaultState = { isSessionLoaded: false };

const SessionContext = createContext<ISessionContext>(defaultState as ISessionContext);

interface ISessionProviderProps extends IHaveChildrenProps {}

const SessionProvider = ({ children }: ISessionProviderProps) => {
    const [ isSessionLoaded, setIsSessionLoaded ] = useState<boolean>(defaultState.isSessionLoaded);
    const { get, data: responseData } = useHttp(getSessionIdUrl);
    const { localStorageService } = useServices();

    const getSessionId = useCallback(async () => {
        if (isSessionLoaded) {
            return;
        }

        await get();
    }, [ get, isSessionLoaded ]);

    useEffect(() => {
        if (responseData != null) {
            console.log(`response use effect response data is not null: ${responseData}`);
            localStorageService.set('session', responseData);
            setIsSessionLoaded(true);
        }
    }, [ localStorageService, responseData ]);

    useEffect(() => {
        const localStorageSession = localStorageService.get('session');
        if (localStorageSession != null) {
            setIsSessionLoaded(true);
        }
    }, [ localStorageService ]);

    const value = { getSessionId, isSessionLoaded };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

const useSession = () => useContext(SessionContext);

export {
    useSession,
};

export default SessionProvider;
