import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import problemResourceFilterableColumns from './problemResourcesGridColumns';

const location = 'all-resources';
const AdministrationProblemResourcesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const selectedFilters = useAppSelector((state) => state.adminProblems[location]?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminProblems[location]?.selectedSorters);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    return (
        <AdministrationGridView
          filterableGridColumnDef={problemResourceFilterableColumns}
          notFilterableGridColumnDef={[]}
          data={undefined}
          error={undefined}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          location={location}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
    );
};
export default AdministrationProblemResourcesPage;
