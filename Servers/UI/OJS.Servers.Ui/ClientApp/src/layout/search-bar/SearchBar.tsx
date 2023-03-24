import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import { Button, ButtonType } from '../../components/guidelines/buttons/Button';
import Form from '../../components/guidelines/forms/Form';
import FormControl, {
    FormControlType,
    IFormControlOnChangeValueType,
} from '../../components/guidelines/forms/FormControl';
import SearchIcon from '../../components/guidelines/icons/SearchIcon';
import { useSearch } from '../../hooks/use-search';

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
    const [ searchParam, setSearchParam ] = useState<string>(defaultState.state.searchValue);
    const [ selectedTerms, setSelectedTerms ] = useState(defaultState.state.selectedTerms);

    const { state: { isVisible }, actions: { toggleVisibility } } = useSearch();
    const navigate = useNavigate();

    const handleOnChangeUpdateSearch = useCallback(
        (searchInput?: IFormControlOnChangeValueType | ChangeEvent<HTMLInputElement>) => {
            setSearchParam(searchInput as string);
        },
        [],
    );

    const handleSubmit = useCallback(
        () => {
            if (!isEmpty(searchParam)) {
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

                setSearchParam('');

                setSelectedTerms(defaultState.state.selectedTerms);

                toggleVisibility();
            }
        },
        [ navigate, searchParam, selectedTerms, toggleVisibility ],
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
        isVisible
            ? (
                <div className={styles.searchContainer}>
                    <Form
                      className={styles.search}
                      onSubmit={handleSubmit}
                      submitButtonClassName={styles.searchButton}
                      disableButton
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
                        <Button
                          onClick={handleSubmit}
                          type={ButtonType.submit}
                          internalClassName={styles.searchButton}
                        >
                            <SearchIcon />
                        </Button>
                        <div className={styles.checkboxContainer}>
                            <FormControl
                              className={styles.checkbox}
                              name={FieldNameType.checkbox}
                              type={FormControlType.checkbox}
                              value={CheckboxSearchValues.contests}
                              checked
                              onClick={handleSelectedCheckboxValue}
                            />
                            <span className={styles.checkboxText}>
                                Contests
                            </span>
                            <FormControl
                              className={styles.checkbox}
                              name={FieldNameType.checkbox}
                              type={FormControlType.checkbox}
                              value={CheckboxSearchValues.problems}
                              checked
                              onClick={handleSelectedCheckboxValue}
                            />
                            <span className={styles.checkboxText}>
                                Problems
                            </span>
                            <FormControl
                              className={styles.checkbox}
                              name={FieldNameType.checkbox}
                              type={FormControlType.checkbox}
                              value={CheckboxSearchValues.users}
                              checked
                              onClick={handleSelectedCheckboxValue}
                            />
                            <span className={styles.checkboxText}>
                                Users
                            </span>
                        </div>
                    </Form>
                </div>
            )
            : null
    );
};
export default SearchBar;
