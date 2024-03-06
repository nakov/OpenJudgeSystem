import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminProblemGroupsFilters, setAdminProblemGroupsSorters } from '../../../redux/features/admin/problemGroupsSlice';
import { useGetAllAdminProblemGroupsQuery } from '../../../redux/services/admin/problemGroupsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import filterableColumns, { returnNonFilterableColumns } from './problemGroupGridColumns';

const LOCATION = 'all-problem-groups';

const AdministrationProblemGroupsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const { data, isLoading, error } = useGetAllAdminProblemGroupsQuery(queryParams);

    const selectedFilters = useSelector((state: IRootStore) => state.adminProblemGroups[LOCATION]?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminProblemGroups[LOCATION]?.selectedSorters);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = () => {
        console.log('Edit button clicked');
    };

    const renderGridSettings = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }} />
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={filterableColumns}
          notFilterableGridColumnDef={returnNonFilterableColumns(onEditClick)}
          data={data}
          renderActionButtons={renderGridSettings}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminProblemGroupsFilters}
          setSorterStateAction={setAdminProblemGroupsSorters}
          location={LOCATION}
          modals={[]}
          legendProps={[ { color: '#FFA1A1', message: 'Problem Group is deleted.' } ]}
        />
    );
};

export default AdministrationProblemGroupsPage;
