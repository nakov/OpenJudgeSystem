import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { persistReducer, persistStore } from 'redux-persist';
// eslint-disable-next-line import/no-extraneous-dependencies
import storage from 'redux-persist/lib/storage';

// features
import { contestsAdminSlice } from './features/admin/contestsAdminSlice';
import submissionDetailsReducer from './features/submissionDetailsSlice';
// services
import contestsAdminService from './services/admin/contestsAdminService';
import participantsAdminService from './services/admin/participantsAdminService';
import submissionDetailsService from './services/submissionDetailsService';

const rootReducer = combineReducers({
    [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
    submissionDetails: submissionDetailsReducer,
    // admin reducers
    [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    [participantsAdminService.reducerPath]: participantsAdminService.reducer,
    [contestsAdminSlice.name]: contestsAdminSlice.reducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

// list reducers with data to be persisted here
const reducersToPersist = [
    contestsAdminSlice.name,
];

const persistRootReducer = persistReducer(persistConfig([ ...reducersToPersist ]), rootReducer);

const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        contestsAdminService.middleware,
        participantsAdminService.middleware,
    ]),
});

export const persistor = persistStore(store);

export default store;
