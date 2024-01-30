import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

// features
import { contestsAdminSlice } from './features/admin/contestsAdminSlice';
import { problemsAdminSlice } from './features/admin/problemsAdminSlice';
import authorizationReducer from './features/authorizationSlice';
import submissionDetailsReducer from './features/submissionDetailsSlice';
import checkerAdminService from './services/admin/checkersAdminService';
import contestCategoriesAdminService from './services/admin/contestCategoriesAdminService';
// services
import contestsAdminService from './services/admin/contestsAdminService';
import participantsAdminService from './services/admin/participantsAdminService';
import problemGroupsAdminService from './services/admin/problemGroupsAdminService';
// services
import problemsAdminService from './services/admin/problemsAdminService';
import submissionTypesAdminService from './services/admin/submissionTypesAdminService';
// features
import authorizationService from './services/authorizationService';
import submissionDetailsService from './services/submissionDetailsService';
import {contestCategoriesAdminSlice} from "./features/admin/contestCategoriesAdminSlice";

const rootReducer = combineReducers({
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    submissionDetails: submissionDetailsReducer,
    // admin reducers
    [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    [participantsAdminService.reducerPath]: participantsAdminService.reducer,
    [problemsAdminService.reducerPath]: problemsAdminService.reducer,
    [contestCategoriesAdminService.reducerPath]: contestCategoriesAdminService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    authorization: authorizationReducer,
    [contestsAdminSlice.name]: contestsAdminSlice.reducer,
    [contestCategoriesAdminSlice.name]: contestCategoriesAdminSlice.reducer,
    [problemsAdminSlice.name]: problemsAdminSlice.reducer,
    [submissionTypesAdminService.reducerPath]: submissionTypesAdminService.reducer,
    [problemGroupsAdminService.reducerPath]: submissionTypesAdminService.reducer,
    [checkerAdminService.reducerPath]: checkerAdminService.reducer,
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
    problemsAdminSlice.name,
    contestCategoriesAdminSlice.name
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
        problemsAdminService.middleware,
        submissionTypesAdminService.middleware,
        problemGroupsAdminService.middleware,
        checkerAdminService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
