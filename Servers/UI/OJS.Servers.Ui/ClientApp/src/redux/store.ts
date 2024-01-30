import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

// features
import { contestsAdminSlice } from './features/admin/contestsAdminSlice';
import { problemGroupsAdminSlice } from './features/admin/problemGroupsSlice';
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

const rootReducer = combineReducers({
    // reducers
    submissionDetails: submissionDetailsReducer,
    authorization: authorizationReducer,
    [contestsAdminSlice.name]: contestsAdminSlice.reducer,
    [problemsAdminSlice.name]: problemsAdminSlice.reducer,
    [problemGroupsAdminSlice.name]: problemGroupsAdminSlice.reducer,

    // services
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    [participantsAdminService.reducerPath]: participantsAdminService.reducer,
    [problemsAdminService.reducerPath]: problemsAdminService.reducer,
    [contestCategoriesAdminService.reducerPath]: contestCategoriesAdminService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    [submissionTypesAdminService.reducerPath]: submissionTypesAdminService.reducer,
    [problemGroupsAdminService.reducerPath]: problemGroupsAdminService.reducer,
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
    problemGroupsAdminSlice.name,
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        contestsAdminService.middleware,
        participantsAdminService.middleware,
        problemGroupsAdminService.middleware,
        contestCategoriesAdminService.middleware,
        authorizationService.middleware,
        problemsAdminService.middleware,
        submissionTypesAdminService.middleware,
        checkerAdminService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
