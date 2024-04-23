import { ChangeEvent, FormEvent, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { CheckboxSearchValues, FieldNameType } from '../../../common/enums';
import useTheme from '../../../hooks/use-theme';
import { setIsVisible, setSearchValue, setSelectedTerms } from '../../../redux/features/searchSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Form from '../../guidelines/forms/Form';
import FormControl, {
    FormControlType,
    IFormControlOnChangeValueType,
} from '../../guidelines/forms/FormControl';

import styles from './SearchBar.module.scss';

const CHECKBOXES: Array<CheckboxSearchValues> = [
    CheckboxSearchValues.contests,
    CheckboxSearchValues.users,
    CheckboxSearchValues.problems,
];

const SearchBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();

    const { searchValue, selectedTerms, isVisible } = useAppSelector((state) => state.search);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor200);

    const composeSearchString = () => {
        const searchStringValue = searchValue
            ? `searchTerm=${searchValue}`
            : '';
        const selectedTermsStringValue = selectedTerms.map((term) => `&${term}=true`).join('');
        return `?${searchStringValue}${selectedTermsStringValue}`;
    };

    useEffect(() => {
        const textInputElement = document.getElementById('search-for-text-input');
        if (textInputElement) {
            textInputElement.focus();
        }
    });

    useEffect(() => {
        const searchString = composeSearchString();
        navigate(`/search${searchString}`);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [ searchValue, selectedTerms ]);

    // hide search bar on page change
    useEffect(() => {
        if (!location.pathname.includes('/search')) {
            dispatch(setIsVisible(false));
        }
    }, [ location.pathname, dispatch ]);

    const handleSubmit = () => {
        navigate({
            pathname: '/search',
            search: composeSearchString(),
        });
    };

    const handleSearchCheckboxClick = (event: FormEvent<HTMLInputElement>) => {
        const { currentTarget: { value: currentValue } } = event;

        if (selectedTerms.includes(currentValue as CheckboxSearchValues)) {
            const newSelectedItems = selectedTerms.filter((term) => term !== currentValue);
            dispatch(setSelectedTerms(newSelectedItems));
        } else {
            dispatch(setSelectedTerms([ ...selectedTerms, (currentValue as CheckboxSearchValues) ]));
        }
    };

    // wait user to stop typing, then dispatch in order not to dispatch on every key click
    const debouncedDispatch = debounce((value: string) => {
        dispatch(dispatch(setSearchValue(value)));
    }, 250);

    const handleSearchInputChange = (searchInput?: IFormControlOnChangeValueType | ChangeEvent<HTMLInputElement>) => {
        debouncedDispatch(searchInput as string);
    };

    return (
        <div
          className={`${styles.searchContainer} ${backgroundColorClassName} ${isVisible
              ? `${styles.show}`
              : ''}`}
        >
            <Form
              className={styles.search}
              onSubmit={handleSubmit}
              hideFormButton
            >
                <FormControl
                  id="search-for-text-input"
                  className={`${styles.searchInput} ${textColorClassName}`}
                  name={FieldNameType.search}
                  type={FormControlType.input}
                  labelText={FieldNameType.search}
                  value={searchValue}
                  shouldDisableLabel
                  onChange={handleSearchInputChange}
                />
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <i className={`fas fa-search ${styles.searchIcon} ${textColorClassName}`} onClick={handleSubmit} />
                <div className={styles.checkboxContainer}>
                    {CHECKBOXES.map((checkbox) => (
                        <div key={`search-bar-checkbox-${checkbox}`} className={styles.checkboxWrapper}>
                            <FormControl
                              className={styles.checkbox}
                              name={FieldNameType.checkbox}
                              type={FormControlType.checkbox}
                              value={checkbox}
                              checked={selectedTerms.includes(CheckboxSearchValues.contests)}
                              onClick={handleSearchCheckboxClick}
                            />
                            <span className={`${styles.checkboxText} ${textColorClassName}`}>
                                {checkbox}
                            </span>
                        </div>
                    ))}
                </div>
            </Form>
            <IoIosClose size={50} onClick={() => dispatch(setIsVisible(!isVisible))} className={styles.closeIcon} />
        </div>
    );
};
export default SearchBar;
