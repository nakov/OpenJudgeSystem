import React, { useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import Form, { FormType } from '../../components/guidelines/forms/Form';
import FormControl, {
    FormControlType,
    IFormControlOnChangeValueType,
} from '../../components/guidelines/forms/FormControl';
import { useSearch } from '../../hooks/use-search';

import styles from './SearchBar.module.scss';

const defaultState = {
    state: {
        searchValue: '',
        selectedTerm: 'All',
    },
};

const searchFieldName = 'Search';
const radioFiledName = 'Radio';
const SearchBar = () => {
    const [ searchParam, setSearchParam ] = useState<string>(defaultState.state.searchValue);
    const [ selectedTerm, setSelectedTerm ] = useState<string>(defaultState.state.selectedTerm);

    const { state: { isVisible } } = useSearch();
    const navigate = useNavigate();

    const handleOnChangeUpdateSearch = useCallback(
        (searchInput?: IFormControlOnChangeValueType) => {
            setSearchParam(searchInput as string);
        },
        [],
    );

    const handleSubmit = useCallback(
        () => {
            if (!isEmpty(searchParam)) {
                const params = { searchTerm: `${searchParam}`, selectedTerm: `${selectedTerm}` };
                navigate({
                    pathname: '/search',
                    search: `?${createSearchParams(params)}`,
                });
            }
        },
        [ navigate, searchParam, selectedTerm ],
    );

    const handleOnKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        },
        [ handleSubmit ],
    );

    const handleSelectedRadioValue = useCallback(
        (valueSelected?: IFormControlOnChangeValueType) => {
            setSelectedTerm(valueSelected as string);
        },
        [],
    );

    return (
        isVisible
            ? (
                <div className={styles.searchContainer}>
                    <Form
                      className={styles.search}
                      onSubmit={handleSubmit}
                      submitButtonClassName={styles.searchButton}
                      type={FormType.search}
                    >
                        <FormControl
                          className={styles.searchInput}
                          name={searchFieldName}
                          type={FormControlType.search}
                          labelText={searchFieldName}
                          onChange={handleOnChangeUpdateSearch}
                          onKeyDown={handleOnKeyDown}
                          value={searchParam}
                        />
                        <FormControl
                          className={styles.radioContainer}
                          name={radioFiledName}
                          type={FormControlType.radio}
                          onChange={handleSelectedRadioValue}
                          value={selectedTerm}
                        />
                    </Form>
                </div>
            )
            : null
    );
};
export default SearchBar;
