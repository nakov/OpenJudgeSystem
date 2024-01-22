import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

import authorizationReducer from './features/authorizationSlice';
// features
import submissionDetailsReducer from './features/submissionDetailsSlice';
import themeReducer from './features/themeSlice';
import authorizationService from './services/authorizationService';
// services
import submissionDetailsService from './services/submissionDetailsService';

const rootReducer = combineReducers({
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    submissionDetails: submissionDetailsReducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    authorization: authorizationReducer,
    theme: themeReducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

// list reducers with data to be persisted here
const reducersToPersist = [
    'authorization',
    'theme',
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        authorizationService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
