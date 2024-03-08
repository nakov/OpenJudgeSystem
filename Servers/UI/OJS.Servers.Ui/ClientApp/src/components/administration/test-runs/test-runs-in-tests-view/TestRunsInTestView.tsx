/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import testRunsFilterableColumns from '../../../../pages/administration-new/test-runs/testRunsGridColumns';
import { setAdminTestsFilters, setAdminTestsSorters } from '../../../../redux/features/admin/testsSlice';
import { useGetTestRunsByTestIdQuery } from '../../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface ITestRunsInTestViewProps {
    testId: number;
}

const TestRunsInTestView = (props: ITestRunsInTestViewProps) => {
    const { testId } = props;
    const location = `tests-testRuns-${testId}`;
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const selectedFilters = useSelector((state: IRootStore) => state.adminTests[location]?.selectedFilters) ?? [];
    const selectedSorters = useSelector((state: IRootStore) => state.adminTests[location]?.selectedSorters) ?? [];

    const { data: testData, error, isLoading } = useGetTestRunsByTestIdQuery({ testId, ...queryParams });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filtersQueryParams ?? '' });
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortersQueryParams ?? '' });
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
          setFilterStateAction={setAdminTestsFilters}
          setSorterStateAction={setAdminTestsSorters}
          location={location}
          withSearchParams={false}

        />
    );
};
export default TestRunsInTestView;
