import { configureStore } from '@reduxjs/toolkit';

import submissionDetailsReducer from './features/submissionDetailsSlice';
import contestsAdminService from './services/admin/contestsAdminService';
import submissionDetailsService from './services/submissionDetailsService';

const store = configureStore({
    reducer: {
        [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
        submissionDetails: submissionDetailsReducer,
        [contestsAdminService.reducerPath]: contestsAdminService.reducer,
    },

    /* Serialized check is turned off because for cases like blobs it gives exception.
    Even when it is not serializable we want to receive the response. */
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([
        submissionDetailsService.middleware,
        contestsAdminService.middleware,
    ]),
});

export default store;
