import { configureStore } from '@reduxjs/toolkit';

import submissionDetailsReducer from './features/submissionDetailsSlice';
import submissionDetailsService from './services/submissionDetailsService';

const store = configureStore({
    reducer: {
        [submissionDetailsService.reducerPath]: submissionDetailsService.reducer,
        submissionDetails: submissionDetailsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(submissionDetailsService.middleware),
});

export default store;
