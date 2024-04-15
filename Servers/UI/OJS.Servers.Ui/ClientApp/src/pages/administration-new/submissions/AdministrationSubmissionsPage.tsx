import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDownloadFileSubmissionQuery,
    useGetAllSubmissionsQuery,
    useLazyExportSubmissionsToExcelQuery,
    useRetestMutation } from '../../../redux/services/admin/submissionsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import downloadFile from '../../../utils/file-download-utils';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../utils/render-utils';
import { IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns, { returnSubmissionsNonFilterableColumns } from './admin-submissions-grid-def';

const AdministrationSubmissionsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);
    const [ successfullMessage, setSuccessfullMessage ] = useState<string | null>(null);

    const [ submissionToDownload, setSubmissionToDownload ] = useState<number | null>(null);
    const [ shouldSkipDownloadOfSubmission, setShouldSkipDownloadOfSubmission ] = useState<boolean>(true);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(dataColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(dataColumns),
    ));

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const {
        refetch: retakeSubmissions,
        data,
        error,
        isLoading,
    } = useGetAllSubmissionsQuery(queryParams);

    const [ retest,
        {
            data: retestData,
            error: retestError,
            isSuccess: isSuccessFullyRetested,
        },
    ] = useRetestMutation();

    const { data: fileSubmission, error: downloadError } = useDownloadFileSubmissionQuery(
        { id: submissionToDownload! },
        { skip: shouldSkipDownloadOfSubmission },
    );

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            { message: retestData, shouldGet: isSuccessFullyRetested },
        ]);
        setSuccessfullMessage(message);
    }, [ isSuccessFullyRetested, retestData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ retestError, downloadError ], setExceptionMessages);
    }, [ downloadError, retestError ]);

    const startDownload = useCallback((id: number) => {
        setSubmissionToDownload(id);
        setShouldSkipDownloadOfSubmission(false);
    }, []);

    useEffect(() => {
        if (fileSubmission?.blob) {
            downloadFile(fileSubmission.blob, fileSubmission.filename);
        }
    }, [ fileSubmission ]);

    if (isLoading) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderSuccessfullAlert(successfullMessage)}
            {renderErrorMessagesAlert(exceptionMessages)}
            <AdministrationGridView
              data={data}
              error={error}
              filterableGridColumnDef={dataColumns}
              notFilterableGridColumnDef={
                returnSubmissionsNonFilterableColumns(retest, startDownload, retakeSubmissions)
            }
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              selectedFilters={selectedFilters || []}
              selectedSorters={selectedSorters || []}
              setSorterStateAction={setSelectedSorters}
              setFilterStateAction={setSelectedFilters}
              legendProps={[ { color: '#FFA1A1', message: 'Submission is deleted.' } ]}
              excelMutation={useLazyExportSubmissionsToExcelQuery}

            />
        </>
    );
};

export default AdministrationSubmissionsPage;
