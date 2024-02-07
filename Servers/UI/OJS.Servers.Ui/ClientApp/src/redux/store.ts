import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

import authorizationReducer, { authorizationSliceName } from './features/authorizationSlice';
import { contestSlice } from './features/contestsSlice';
import submissionDetailsReducer from './features/submissionDetailsSlice';
import themeReducer, { themeSliceName } from './features/themeSlice';
import authorizationService from './services/authorizationService';
import { contestsService } from './services/contestsService';
import { homeStatisticsService } from './services/homeStatisticsService';
import submissionDetailsService from './services/submissionDetailsService';

const rootReducer = combineReducers({
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    [homeStatisticsService.reducerPath]: homeStatisticsService.reducer,
    submissionDetails: submissionDetailsReducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    [contestsService.reducerPath]: contestsService.reducer,
    authorization: authorizationReducer,
    theme: themeReducer,
    [contestSlice.name]: contestSlice.reducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

// list reducers with data to be persisted here
const reducersToPersist = [
    authorizationSliceName,
    themeSliceName,
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        authorizationService.middleware,
        contestsService.middleware,
        homeStatisticsService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
