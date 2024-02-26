import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import Form from '../../components/guidelines/forms/Form';
import FormControl, {
    FormControlType,
    IFormControlOnChangeValueType,
} from '../../components/guidelines/forms/FormControl';
import { useSearch } from '../../hooks/use-search';
import useTheme from '../../hooks/use-theme';
import { getSearchPageURL } from '../../utils/urls';

import styles from './SearchBar.module.scss';

enum FieldNameType {
    search = 'Search',
    checkbox = 'Radio',
}

enum CheckboxSearchValues {
    contests = 'Contests',
    problems = 'Problems',
    users = 'Users',
}

const defaultState = {
    state: {
        searchValue: '',
        selectedTerms: [
            `${CheckboxSearchValues.contests}`,
            `${CheckboxSearchValues.problems}`,
            `${CheckboxSearchValues.users}`,
        ],
    },
};

const SearchBar = () => {
    const { themeColors, getColorClassName } = useTheme();
    const [ searchParam, setSearchParam ] = useState<string>(defaultState.state.searchValue);
    const [ selectedTerms, setSelectedTerms ] = useState(defaultState.state.selectedTerms);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    const {
        state:
        {
            isVisible,
            getSearchResultsUrlParams,
        },
        actions: { toggleVisibility },
    } = useSearch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleOnChangeUpdateSearch = useCallback(
        (searchInput?: IFormControlOnChangeValueType | ChangeEvent<HTMLInputElement>) => {
            setSearchParam(searchInput as string);
        },
        [ ],
    );

    // Effect helps manage SearchBar's state and value on SearchPage refresh
    // Checks if the Bar's state has been reset to default
    // but the user is in the search page and there are query params in the URL
    // Result: Syncs the SearchBar values with the url params and ensures the SearchBar is visible.
    useEffect(() => {
        const isDefaultBarState = () => searchParam === defaultState.state.searchValue &&
            selectedTerms === defaultState.state.selectedTerms;

        if (isDefaultBarState() &&
            location.pathname === getSearchPageURL() && getSearchResultsUrlParams) {
            setSearchParam(getSearchResultsUrlParams.searchTerm);
            const selectedTermNames = getSearchResultsUrlParams.selectedTerms.map((termObj) => termObj.key);
            setSelectedTerms(selectedTermNames);

            if (!isVisible) {
                toggleVisibility();
            }
        }
    }, [ location, getSearchResultsUrlParams, selectedTerms, searchParam, isVisible, toggleVisibility ]);

    const handleSubmit = useCallback(
        () => {
            const params = {
                searchTerm: `${searchParam.trim()}`,
                ...selectedTerms.reduce(
                    (obj, term) => ({ ...obj, [term]: 'true' }),
                    {},
                ),
            };
            navigate({
                pathname: '/search',
                search: `?${createSearchParams(params)}`,
            });
        },
        [ navigate, searchParam, selectedTerms ],
    );

    const handleSelectedCheckboxValue = useCallback(
        (event: FormEvent<HTMLInputElement>) => {
            const { currentTarget: { value: currentValue } } = event;

            if (selectedTerms.includes(currentValue)) {
                const newSelectedItems = selectedTerms.filter((term) => term !== currentValue);

                setSelectedTerms(newSelectedItems);
            } else {
                setSelectedTerms([ ...selectedTerms, currentValue ]);
            }
        },
        [ selectedTerms ],
    );

    return (
        <div
          className={`${styles.searchContainer} ${backgroundColorClassName} ${isVisible
              ? `${styles.show}`
              : ''}`}
        >
            <IoIosClose size={50} onClick={toggleVisibility} className={styles.closeIcon} />
            <Form
              className={styles.search}
              onSubmit={handleSubmit}
              hideFormButton
            >
                <FormControl
                  className={styles.searchInput}
                  name={FieldNameType.search}
                  type={FormControlType.input}
                  labelText={FieldNameType.search}
                  onChange={handleOnChangeUpdateSearch}
                  value={searchParam}
                  shouldDisableLabel
                />
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <i className={`fas fa-search ${styles.searchIcon} ${textColorClassName}`} onClick={handleSubmit} />
                <div className={styles.checkboxContainer}>
                    <FormControl
                      className={styles.checkbox}
                      name={FieldNameType.checkbox}
                      type={FormControlType.checkbox}
                      value={CheckboxSearchValues.contests}
                      checked={selectedTerms.includes(CheckboxSearchValues.contests)}
                      onClick={handleSelectedCheckboxValue}
                    />
                    <span className={`${styles.checkboxText} ${textColorClassName}`}>
                        Contests
                    </span>
                    <FormControl
                      className={styles.checkbox}
                      name={FieldNameType.checkbox}
                      type={FormControlType.checkbox}
                      value={CheckboxSearchValues.problems}
                      checked={selectedTerms.includes(CheckboxSearchValues.problems)}
                      onClick={handleSelectedCheckboxValue}
                    />
                    <span className={`${styles.checkboxText} ${textColorClassName}`}>
                        Problems
                    </span>
                    <FormControl
                      className={styles.checkbox}
                      name={FieldNameType.checkbox}
                      type={FormControlType.checkbox}
                      value={CheckboxSearchValues.users}
                      checked={selectedTerms.includes(CheckboxSearchValues.users)}
                      onClick={handleSelectedCheckboxValue}
                    />
                    <span className={`${styles.checkboxText} ${textColorClassName}`}>
                        Users
                    </span>
                </div>
            </Form>
        </div>
    );
};
export default SearchBar;
