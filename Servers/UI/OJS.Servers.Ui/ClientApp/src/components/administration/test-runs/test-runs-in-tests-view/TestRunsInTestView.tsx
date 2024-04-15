import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../../common/types';
import { IAdministrationFilter, mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import testRunsFilterableColumns from '../../../../pages/administration-new/test-runs/testRunsGridColumns';
import { useGetTestRunsByTestIdQuery } from '../../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface ITestRunsInTestViewProps {
    testId: number;
}

const TestRunsInTestView = (props: ITestRunsInTestViewProps) => {
    const { testId } = props;
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const { data: testData, error, isLoading } = useGetTestRunsByTestIdQuery({ testId, ...queryParams });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filtersQueryParams ?? '' }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortersQueryParams ?? '' }));
    }, [ sortersQueryParams ]);

    if (isLoading) {
        return (
            <SpinningLoader />
        );
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={testRunsFilterableColumns}
          notFilterableGridColumnDef={[]}
          data={testData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          withSearchParams={false}

        />
    );
};
export default TestRunsInTestView;
