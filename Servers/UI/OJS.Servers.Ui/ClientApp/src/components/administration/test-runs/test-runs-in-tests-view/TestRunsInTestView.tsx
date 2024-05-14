import { useState } from 'react';

import { IGetAllAdminParams } from '../../../../common/types';
import { applyDefaultFilterToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import AdministrationGridView, { defaultSorterToAdd } from '../../../../pages/administration-new/AdministrationGridView';
import testRunsFilterableColumns from '../../../../pages/administration-new/test-runs/testRunsGridColumns';
import { useGetTestRunsByTestIdQuery } from '../../../../redux/services/admin/testsAdminService';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface ITestRunsInTestViewProps {
    testId: number;
}

const TestRunsInTestView = (props: ITestRunsInTestViewProps) => {
    const { testId } = props;

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>(applyDefaultFilterToQueryString('', defaultSorterToAdd));

    const { data: testData, error, isLoading } = useGetTestRunsByTestIdQuery({ testId, ...queryParams });

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
          withSearchParams={false}
        />
    );
};
export default TestRunsInTestView;
