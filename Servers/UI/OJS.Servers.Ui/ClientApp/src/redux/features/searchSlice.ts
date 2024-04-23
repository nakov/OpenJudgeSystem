import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckboxSearchValues } from '../../common/enums';
import { ISearchSliceState } from '../../common/types';

const initialState: ISearchSliceState = {
    isVisible: false,
    searchValue: '',
    selectedTerms: [
        CheckboxSearchValues.contests,
        CheckboxSearchValues.problems,
        CheckboxSearchValues.users,
    ],
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setIsVisible: (state: ISearchSliceState, action: PayloadAction<boolean>) => {
            state.isVisible = action.payload;
        },
        setSearchValue: (state: ISearchSliceState, action: PayloadAction<string>) => {
            state.searchValue = action.payload;
        },
        setSelectedTerms: (state: ISearchSliceState, action: PayloadAction<Array<CheckboxSearchValues>>) => {
            state.selectedTerms = action.payload;
        },
        setSelectedTermsDefaultValue: (state: ISearchSliceState) => {
            state.selectedTerms = initialState.selectedTerms;
        }
        // addSelectedTerm: (state: ISearchSliceState, action: PayloadAction<CheckboxSearchValues.contests | CheckboxSearchValues.problems | CheckboxSearchValues.users>) => {
        //     state.selectedTerms.push(action.payload);
        // },
        // removeSelectedTerm: (state: ISearchSliceState, action: PayloadAction<CheckboxSearchValues.contests | CheckboxSearchValues.problems | CheckboxSearchValues.users>) => {
        //     const indexOfElement = state.selectedTerms.indexOf(action.payload);
        //
        //     if (indexOfElement !== -1) {
        //         state.selectedTerms.splice(indexOfElement, 1);
        //     }
        // }
    },
});

export const {
    setIsVisible,
    setSearchValue,
    setSelectedTerms,
    setSelectedTermsDefaultValue,
} = searchSlice.actions;

export default searchSlice.reducer;
