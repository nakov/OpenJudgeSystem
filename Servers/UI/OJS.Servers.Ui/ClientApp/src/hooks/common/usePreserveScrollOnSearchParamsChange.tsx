import { useEffect, useRef } from 'react';
import { NavigateOptions, URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

const usePreserveScrollOnSearchParamsChange =
    (paramNames?: string[]): [URLSearchParams, (newParams: URLSearchParamsInit, navigateOpts?: NavigateOptions) => void] => {
        const [ searchParams, setSearchParams ] = useSearchParams();
        const scrollPosition = useRef(0);

        const updateSearchParams = (newParams: URLSearchParamsInit, navigateOpts?: NavigateOptions) => {
            scrollPosition.current = window.scrollY;
            setSearchParams(newParams, navigateOpts);
        };

        useEffect(() => {
            const containsAnyParam = paramNames?.some((paramName) => searchParams.has(paramName));
            if (isEmpty(paramNames) || containsAnyParam) {
                window.scrollTo(0, scrollPosition.current);
            }
        }, [ paramNames, searchParams ]);

        return [ searchParams, updateSearchParams ];
    };

export default usePreserveScrollOnSearchParamsChange;
