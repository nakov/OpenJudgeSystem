import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllSubmissionsQuery, useLazyExportSubmissionsForProcessingToExcelQuery } from '../../../redux/services/admin/submissionsForProcessingAdminService';
import { applyDefaultFilterToQueryString } from '../administration-filters/AdministrationFilters';
import AdministrationGridView, { defaultSorterToAdd } from '../AdministrationGridView';

import dataColumns, {
    returnSubmissionsForProcessingNonFilterableColumns,
} from './admin-submissions-for-processing-grid-def';

const AdministrationSubmissionsForProcessingPage = () => {
    const [ searchParams ] = useSearchParams();

    // eslint-disable-next-line max-len
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>(applyDefaultFilterToQueryString('', defaultSorterToAdd, searchParams));

    const {
        data,
        error,
        isLoading,
    } = useGetAllSubmissionsQuery(queryParams);

    if (isLoading) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={dataColumns}
          notFilterableGridColumnDef={returnSubmissionsForProcessingNonFilterableColumns()}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          excelMutation={useLazyExportSubmissionsForProcessingToExcelQuery}
        />
    );
};

export default AdministrationSubmissionsForProcessingPage;
