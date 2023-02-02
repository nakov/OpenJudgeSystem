import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Form, { FormType } from '../../components/guidelines/forms/Form';
import FormControl, {
    FormControlType,
    IFormControlOnChangeValueType,
} from '../../components/guidelines/forms/FormControl';
import { useSearch } from '../../hooks/use-search';

import styles from './SearchBar.module.scss';

const defaultState = { state: { searchValue: '' } };

const searchFieldName = 'Search';

const SearchBar = () => {
    const [ searchParam, setSearchParam ] = useState<string>(defaultState.state.searchValue);
    const { actions: { changeSearchValue } } = useSearch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleOnChangeUpdateSearch = useCallback(
        (searchInput?: IFormControlOnChangeValueType) => {
            setSearchParam(searchInput as string);
        },
        [],
    );

    const handleSubmit = useCallback(
        () => {
            if (pathname !== '/search') {
                navigate('/search');
            }

            changeSearchValue(searchParam);
        },
        [ changeSearchValue, navigate, pathname, searchParam ],
    );

    const handleOnKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        },
        [ handleSubmit ],
    );

    return (
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
        </Form>
    );
};
export default SearchBar;
