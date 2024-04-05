/* eslint-disable import/exports-last */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/group-exports */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUserType } from '../../common/types';

export interface IAuthorizationReduxState {
    internalUser: IUserType;
    defaultLoginErrorMessage: string;
    isLoggedIn: boolean;
}

const initialState: IAuthorizationReduxState = {
    internalUser: {
        id: '',
        userName: '',
        email: '',
        permissions: { canAccessAdministration: false },
        isInRole: false,
        isAdmin: false,
        canAccessAdministration: false,
    } as IUserType,
    defaultLoginErrorMessage: 'Invalid username or password',
    isLoggedIn: false,

};

export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setInternalUser: (state, action) => {
            state.internalUser = action.payload;
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
            if (state.isLoggedIn && state.internalUser.isAdmin) {
                state.internalUser.canAccessAdministration = true;
            }
        },
        resetInInternalUser: (state) => {
            state.internalUser = initialState.internalUser;
        },
    },
});

export const { setInternalUser, setIsLoggedIn, resetInInternalUser } = authorizationSlice.actions;

export const authorizationSliceName = authorizationSlice.name;

export default authorizationSlice.reducer;
