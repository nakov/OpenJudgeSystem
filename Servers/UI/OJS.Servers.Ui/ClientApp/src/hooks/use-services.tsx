import React, {
    createContext,
    useContext,
    useMemo,
} from 'react';

import { IHaveChildrenProps } from '../components/common/Props';
import CacheService from '../services/storage-service';

interface IServicesContext {
    localStorageService: CacheService
}

const defaultState = { };

const ServicesContext = createContext<IServicesContext>(defaultState as IServicesContext);

interface IServicesProviderProps extends IHaveChildrenProps {}

const ServicesProvider = ({ children }: IServicesProviderProps) => {
    const localStorageService = useMemo(() => new CacheService(window.localStorage), []);

    const value = { localStorageService };

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
};

const useServices = () => useContext(ServicesContext);

export {
    useServices,
};

export default ServicesProvider;
