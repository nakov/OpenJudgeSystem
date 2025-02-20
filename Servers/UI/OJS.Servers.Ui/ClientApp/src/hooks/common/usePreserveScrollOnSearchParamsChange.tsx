import { NavigateOptions, URLSearchParamsInit, useSearchParams } from 'react-router-dom';

const usePreserveScrollOnSearchParamsChange = ():
    [URLSearchParams, (newParams: URLSearchParamsInit, navigateOpts?: NavigateOptions) => void] => {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const updateSearchParams = (newParams: URLSearchParamsInit, navigateOpts?: NavigateOptions) => {
        setSearchParams(newParams, { preventScrollReset: true, ...navigateOpts });
    };

    return [ searchParams, updateSearchParams ];
};

export default usePreserveScrollOnSearchParamsChange;
