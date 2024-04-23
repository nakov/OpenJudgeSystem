import { useAppSelector } from '../../redux/store';

import styles from './SearchPageNew.module.scss';

const SearchPageNew = () => {
    const { searchValue, selectedTerms } = useAppSelector((state) => state.search);
    console.log('search page new');

    return (<div>Search page new</div>);
};

export default SearchPageNew;
