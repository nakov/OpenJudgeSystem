import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form, { FormType } from '../../components/guidelines/forms/Form';
import FormControl, { FormControlType } from '../../components/guidelines/forms/FormControl';

import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const [ searchValue, setSearchValue ] = useState<string>();
    const navigate = useNavigate();
    const searchFieldName = 'Search';

    const handleOnChangeUpdateSearch = useCallback(
        (searchInput?: string) => {
            setSearchValue(searchInput);
        },
        [],
    );

    const handleSubmit = useCallback(
        () => {
            navigate('/search', { state: searchValue });
        },
        [ navigate, searchValue ],
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
              onKeyDown={(ev:React.KeyboardEvent<HTMLInputElement>) => handleOnKeyDown(ev)}
              value={searchValue}
            />
        </Form>
    );
};
export default SearchBar;
