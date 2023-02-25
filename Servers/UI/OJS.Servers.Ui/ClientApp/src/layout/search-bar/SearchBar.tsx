import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import { SearchParams } from '../../common/search-types';
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
    const { actions: { encodeUrlToURIComponent } } = useSearch();
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
                const encodedUrl = encodeUrlToURIComponent(searchParam);
                navigate({
                    pathname: '/search',
                    search: `?${SearchParams.search}=${encodedUrl}`,
                });
            }
        },
        [ encodeUrlToURIComponent, navigate, searchParam ],
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
