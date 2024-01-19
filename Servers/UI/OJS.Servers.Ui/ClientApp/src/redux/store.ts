import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

// features
import { contestsAdminSlice } from './features/admin/contestsAdminSlice';
import authorizationReducer from './features/authorizationSlice';
import submissionDetailsReducer from './features/submissionDetailsSlice';
import contestCategoriesAdminService from './services/admin/contestCategoriesAdminService';
// services
import contestsAdminService from './services/admin/contestsAdminService';
import participantsAdminService from './services/admin/participantsAdminService';
// features
import authorizationService from './services/authorizationService';
// services
import submissionDetailsService from './services/submissionDetailsService';

const rootReducer = combineReducers({
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    submissionDetails: submissionDetailsReducer,
    // admin reducers
    [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    [participantsAdminService.reducerPath]: participantsAdminService.reducer,
    [contestsAdminSlice.name]: contestsAdminSlice.reducer,
    [contestCategoriesAdminService.reducerPath]: contestCategoriesAdminService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    authorization: authorizationReducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

// list reducers with data to be persisted here
const reducersToPersist = [
    contestsAdminSlice.name,
    'authorization',
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        contestsAdminService.middleware,
        participantsAdminService.middleware,
        contestCategoriesAdminService.middleware,
        authorizationService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
