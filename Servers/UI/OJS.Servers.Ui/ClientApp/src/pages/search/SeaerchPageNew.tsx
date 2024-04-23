import { useCallback, useEffect } from 'react';

import { CheckboxSearchValues } from '../../common/enums';
import { IContestType, IPagedResultType, IProblemType, IUserType } from '../../common/types';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../hooks/use-theme';
import {
    useLazyGetContestsSearchQuery,
    useLazyGetProblemsSearchQuery,
    useLazyGetUsersSearchQuery,
} from '../../redux/services/searchService';
import { useAppSelector } from '../../redux/store';

import styles from './SearchPageNew.module.scss';

const SearchPageNew = () => {
    const { getColorClassName, themeColors } = useTheme();
    const { searchValue, selectedTerms } = useAppSelector((state) => state.search);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [
        getContestsSearch, {
            data: contestsSearchData,
            isLoading: contestsSearchLoading,
            isError: contestsSearchError,
        } ] = useLazyGetContestsSearchQuery();
    const [
        getProblemsSearch, {
            data: problemsSearchData,
            isLoading: problemsSearchLoading,
            isError: problemsSearchError,
        } ] = useLazyGetProblemsSearchQuery();
    const [
        getUsersSearch, {
            data: usersSearchData,
            isLoading: usersSearchLoading,
            isError: usersSearchError,
        },
    ] = useLazyGetUsersSearchQuery();

    // initiate the search
    useEffect(() => {
        if (searchValue.length < 3 || selectedTerms.length === 0) {
            return;
        }
        if (selectedTerms.includes(CheckboxSearchValues.problems)) {
            getProblemsSearch({ searchTerm: searchValue });
        }
        if (selectedTerms.includes(CheckboxSearchValues.contests)) {
            getContestsSearch({ searchTerm: searchValue });
        }
        if (selectedTerms.includes(CheckboxSearchValues.users)) {
            getUsersSearch({ searchTerm: searchValue });
        }
    }, [ searchValue, selectedTerms, getProblemsSearch, getContestsSearch, getUsersSearch ]);

    const renderSearchFragmentResults = useCallback((
        searchName: string,
        data: IPagedResultType<IContestType> | IPagedResultType<IUserType> | IPagedResultType<IProblemType> | undefined,
        isLoading: boolean,
        error: boolean,
    ) => {
        if (isLoading) {
            return <SpinningLoader />;
        }
        if (error) {
            return (
                <div>
                    Error fetching
                    {' '}
                    {searchName}
                </div>
            );
        }
        return (
            <div>
                {searchName}
            </div>
        );
    }, []);

    return (
        <div className={`${styles.searchPageWrapper} ${textColorClassName}`}>
            {searchValue.length < 3
                ? <div>The search term must be at least 3 characters!</div>
                : (
                    <>
                        {renderSearchFragmentResults('Contests', contestsSearchData, contestsSearchLoading, contestsSearchError)}
                        {renderSearchFragmentResults('Problems', problemsSearchData, problemsSearchLoading, problemsSearchError)}
                        {renderSearchFragmentResults('Users', usersSearchData, usersSearchLoading, usersSearchError)}
                    </>
                )}
        </div>
    );
};

export default SearchPageNew;
