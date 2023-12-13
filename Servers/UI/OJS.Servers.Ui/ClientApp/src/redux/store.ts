import { configureStore } from '@reduxjs/toolkit';

import submissionDetailsReducer from './features/submissionDetailsSlice';
import submissionDetailsService from './services/submissionDetailsService';
import { contestService } from "./services/contestsService";
import { contestSlice } from "./features/contestSlice";

const store = configureStore({
    reducer: {
        [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
        submissionDetails: submissionDetailsReducer,
        [contestService.reducerPath]: contestService.reducer,
        [contestSlice.name]: contestSlice.reducer
    },

    /* Serialized check is turned off because for cases like blobs it gives exception.
    Even when it is not serializable we want to receive the response. */
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([
            submissionDetailsService.middleware,
            contestService.middleware
        ])
});

export default store;
