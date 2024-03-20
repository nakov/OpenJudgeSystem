import { createSlice } from '@reduxjs/toolkit';

import { usersSliceName } from '../../common/reduxNames';
import { IUsersState } from '../../common/types';

const initialState: IUsersState = { profile: null };

export const usersSlice = createSlice({
    name: usersSliceName,
    initialState,
    reducers: {
        setProfile: (state: IUsersState, action) => {
            state.profile = action.payload;
        },
    },
});

const { setProfile } = usersSlice.actions;

export {
    setProfile,
};

export default usersSlice.reducer;
