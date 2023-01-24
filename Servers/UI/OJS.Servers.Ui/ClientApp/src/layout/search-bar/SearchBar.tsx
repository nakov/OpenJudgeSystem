import React from 'react';

import SearchIcon from '../../components/guidelines/icons/SearchIcon';

import styles from './SearchBar.module.scss';

const SearchBar = () => {
    const searchFieldName = 'Search';

    return (
        <form
          className={styles.search}
        >
            <input
              className={styles.searchInput}
              type="text"
              name={searchFieldName}
              placeholder={searchFieldName}
            />
            <button className={styles.searchButton} type="submit">
                <SearchIcon />
            </button>
        </form>

    );
};
export default SearchBar;
