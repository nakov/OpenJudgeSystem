import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import {
    setAdminSubmissionsFilters,
    setAdminSubmissionsSorters,
} from '../../../redux/features/admin/submissionsAdminSlice';
import { useDeleteSubmissionMutation,
    useDownloadFileSubmissionQuery,
    useExportSubmissionsToExcelQuery,
    useGetAllSubmissionsQuery,
    useRetestMutation } from '../../../redux/services/admin/submissionsAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import downloadFile from '../../../utils/file-download-utils';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../utils/render-utils';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns, { returnSubmissionsNonFilterableColumns } from './admin-submissions-grid-def';

const AdministrationSubmissionsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);
    const [ successfullMessage, setSuccessfullMessage ] = useState<string | null>(null);

    const [ submissionToDownload, setSubmissionToDownload ] = useState<number | null>(null);
    const [ shouldSkipDownloadOfSubmission, setShouldSkipDownloadOfSubmission ] = useState<boolean>(true);

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const selectedFilters =
        useAppSelector((state) => state.adminSubmissions['all-submissions']?.selectedFilters);

    const selectedSorters =
        useAppSelector((state) => state.adminSubmissions['all-submissions']?.selectedSorters);

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

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            { message: retestData, shouldGet: isSuccessFullyRetested },
        ]);
        setSuccessfullMessage(message);
    }, [ isSuccessFullyRetested, retestData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ retestError, downloadError ], setExceptionMessages);
    }, [ downloadError, retestError ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

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
                returnSubmissionsNonFilterableColumns(useDeleteSubmissionMutation, retest, startDownload, retakeSubmissions)
            }
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              selectedFilters={selectedFilters || []}
              selectedSorters={selectedSorters || []}
              setFilterStateAction={setAdminSubmissionsFilters}
              setSorterStateAction={setAdminSubmissionsSorters}
              location="all-submissions"
              legendProps={[ { color: '#FFA1A1', message: 'Submission is deleted.' } ]}
              excelMutation={useExportSubmissionsToExcelQuery}

            />
        </>
    );
};

export default AdministrationSubmissionsPage;
