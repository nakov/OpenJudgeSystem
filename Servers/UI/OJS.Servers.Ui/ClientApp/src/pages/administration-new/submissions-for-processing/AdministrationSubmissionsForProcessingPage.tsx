import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { VIEW } from '../../../common/labels';
import { IGetAllAdminParams } from '../../../common/types';
import { NEW_ADMINISTRATION_PATH, SUBMISSIONS_FOR_PROCESSING_PATH } from '../../../common/urls/administration-urls';
import RedirectButton from '../../../components/administration/common/edit/RedirectButton';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllSubmissionsQuery, useLazyExportSubmissionsForProcessingToExcelQuery } from '../../../redux/services/admin/submissionsForProcessingAdminService';
import { applyDefaultFilterToQueryString } from '../administration-filters/AdministrationFilters';
import AdministrationGridView, { defaultSorterToAdd } from '../AdministrationGridView';

import dataColumns from './admin-submissions-for-processing-grid-def';

const AdministrationSubmissionsForProcessingPage = () => {
    const [ searchParams ] = useSearchParams();

    // eslint-disable-next-line max-len
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>(applyDefaultFilterToQueryString('', defaultSorterToAdd, searchParams));

    const {
        data,
        error,
        isLoading,
    } = useGetAllSubmissionsQuery(queryParams);

    const nonFilterableColumns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <RedirectButton
                      path={`/${NEW_ADMINISTRATION_PATH}/${SUBMISSIONS_FOR_PROCESSING_PATH}/${Number(params.row.id)}`}
                      location={VIEW}
                    />
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <SpinningLoader />;
    }
    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={dataColumns}
          notFilterableGridColumnDef={nonFilterableColumns}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          excelMutation={useLazyExportSubmissionsForProcessingToExcelQuery}
        />
    );
};

export default AdministrationSubmissionsForProcessingPage;
