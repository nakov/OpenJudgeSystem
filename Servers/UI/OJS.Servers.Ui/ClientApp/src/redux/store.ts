import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// features
import { authorizationSlice } from './features/authorizationSlice';
import { contestSlice } from './features/contestsSlice';
import { submissionDetailsSlice } from './features/submissionDetailsSlice';
import { submissionsSlice } from './features/submissionsSlice';
import { themeSlice } from './features/themeSlice';
import checkerAdminService from './services/admin/checkersAdminService';
import contestCategoriesAdminService from './services/admin/contestCategoriesAdminService';
// admin services
import contestsAdminService from './services/admin/contestsAdminService';
import examGroupsService from './services/admin/examGroupsAdminService';
import participantsAdminService from './services/admin/participantsAdminService';
import problemGroupsAdminService from './services/admin/problemGroupsAdminService';
import { problemResourcesAdminService } from './services/admin/problemResourcesAdminService';
// services
import problemsAdminService from './services/admin/problemsAdminService';
import rolesAdminService from './services/admin/rolesAdminService';
import submissionsAdminService from './services/admin/submissionsAdminService';
import submissionsForProcessingAdminService from './services/admin/submissionsForProcessingAdminService';
import submissionTypesAdminService from './services/admin/submissionTypesAdminService';
import testsAdminService from './services/admin/testsAdminService';
import usersAdminService from './services/admin/usersAdminService';
// features
import authorizationService from './services/authorizationService';
import { contestsService } from './services/contestsService';
import { homeStatisticsService } from './services/homeStatisticsService';
import submissionDetailsService from './services/submissionDetailsService';
import submissionsService from './services/submissionsService';

const rootReducer = combineReducers({
    // reducers
    [submissionsSlice.name]: submissionsSlice.reducer,
    [submissionDetailsSlice.name]: submissionDetailsSlice.reducer,
    [authorizationSlice.name]: authorizationSlice.reducer,
    [themeSlice.name]: themeSlice.reducer,
    [contestSlice.name]: contestSlice.reducer,

    // services
    [submissionsService.reducerPath]: submissionsService.reducer,
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    [homeStatisticsService.reducerPath]: homeStatisticsService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    [contestsService.reducerPath]: contestsService.reducer,
    [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    [submissionsAdminService.reducerPath]: submissionsAdminService.reducer,
    [submissionsForProcessingAdminService.reducerPath]: submissionsForProcessingAdminService.reducer,
    [participantsAdminService.reducerPath]: participantsAdminService.reducer,
    [problemsAdminService.reducerPath]: problemsAdminService.reducer,
    [contestCategoriesAdminService.reducerPath]: contestCategoriesAdminService.reducer,
    [submissionTypesAdminService.reducerPath]: submissionTypesAdminService.reducer,
    [problemGroupsAdminService.reducerPath]: problemGroupsAdminService.reducer,
    [checkerAdminService.reducerPath]: checkerAdminService.reducer,
    [testsAdminService.reducerPath]: testsAdminService.reducer,
    [problemResourcesAdminService.reducerPath]: problemResourcesAdminService.reducer,
    [usersAdminService.reducerPath]: usersAdminService.reducer,
    [rolesAdminService.reducerPath]: rolesAdminService.reducer,
    [examGroupsService.reducerPath]: examGroupsService.reducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

// list reducers with data to be persisted here
const reducersToPersist = [
    themeSlice.name,
    authorizationSlice.name,
    contestSlice.name,
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionsService.middleware,
        submissionDetailsService.middleware,
        contestsAdminService.middleware,
        participantsAdminService.middleware,
        problemGroupsAdminService.middleware,
        contestCategoriesAdminService.middleware,
        authorizationService.middleware,
        contestsService.middleware,
        homeStatisticsService.middleware,
        problemsAdminService.middleware,
        submissionsAdminService.middleware,
        submissionsForProcessingAdminService.middleware,
        submissionTypesAdminService.middleware,
        checkerAdminService.middleware,
        testsAdminService.middleware,
        problemResourcesAdminService.middleware,
        usersAdminService.middleware,
        rolesAdminService.middleware,
        examGroupsService.middleware,
    ]),
});

const persistor = persistStore(store);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
const useAppDispatch = () => useReduxDispatch<AppDispatch>();

export {
    persistor,
    useAppSelector,
    useAppDispatch,
};

export default store;
