import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import { setAdminProblemResourceFilters, setAdminProblemResourceSorters } from '../../../redux/features/admin/problemResourcesAdminSlice';
import { useGetAllAdminProblemResourcesQuery } from '../../../redux/services/admin/problemResourcesAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import problemResourceFilterableColumns, { returnProblemResourceNonFilterableColumns } from './problemResourcesGridColumns';

const location = 'all-resources';
const AdministrationProblemResourcesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const selectedFilters = useAppSelector((state) => state.adminProblemResources[location]?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminProblemResources[location]?.selectedSorters);

    const { data, error } = useGetAllAdminProblemResourcesQuery(queryParams);
    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = () => {
        console.log('Edit clicked');
    };

    return (
        <AdministrationGridView
          filterableGridColumnDef={problemResourceFilterableColumns}
          notFilterableGridColumnDef={returnProblemResourceNonFilterableColumns(onEditClick)}
          data={data}
          error={error}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          location={location}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setFilterStateAction={setAdminProblemResourceFilters}
          setSorterStateAction={setAdminProblemResourceSorters}
          legendProps={[ { color: '#FFA1A1', message: 'Resource is deleted.' } ]}
        />
    );
};
export default AdministrationProblemResourcesPage;
