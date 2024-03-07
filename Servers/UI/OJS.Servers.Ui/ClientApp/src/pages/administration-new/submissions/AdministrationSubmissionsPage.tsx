/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { VIEW } from '../../../common/labels';
import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import DeleteButton from '../../../components/administration/common/delete/DeleteButton';
import ViewRedirectButton from '../../../components/administration/common/edit/ViewRedirectButton';
import IconSize from '../../../components/guidelines/icons/common/icon-sizes';
import DownloadIcon from '../../../components/guidelines/icons/DownloadIcon';
import RefreshIcon from '../../../components/guidelines/icons/RefreshIcon';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import {
    setAdminSubmissionsFilters,
    setAdminSubmissionsSorters,
} from '../../../redux/features/admin/submissionsAdminSlice';
import { useDeleteSubmissionMutation,
    useDownloadFileSubmissionQuery,
    useGetAllSubmissionsQuery,
    useRetestMutation } from '../../../redux/services/admin/submissionsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import dataColumns from './admin-submissions-grid-def';

const AdministrationSubmissionsPage = () => {
    const [ submissionToDownload, setSubmissionToDownload ] = useState<number | null>(null);
    const [ shouldSkipDownloadOfSubmission, setShouldSkipDownloadOfSubmission ] = useState<boolean>(true);
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] =
        useState<IGetAllAdminParams>({
            page: 1,
            itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        });

    const selectedFilters =
        useSelector((state: IRootStore) => state.adminSubmissions['all-submissions']?.selectedFilters);

    const selectedSorters =
        useSelector((state: IRootStore) => state.adminSubmissions['all-submissions']?.selectedSorters);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const {
        data,
        error,
        isLoading,
        isFetching,
    } = useGetAllSubmissionsQuery(queryParams);

    const { data: fileSubmission } = useDownloadFileSubmissionQuery(
        { id: submissionToDownload! },
        { skip: shouldSkipDownloadOfSubmission },
    );

    const startDownload = useCallback((id: number) => {
        setSubmissionToDownload(id);
        setShouldSkipDownloadOfSubmission(false);
    }, []);

    // TODO: Extract this in helpers
    const saveAttachment = (blob:Blob, filename: string) => {
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;

        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    };

    useEffect(() => {
        if (fileSubmission?.blob) {
            saveAttachment(fileSubmission.blob, fileSubmission.filename);
        }
    }, [ fileSubmission ]);

    const [ retest ] = useRetestMutation();

    const nonFilterableColumns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                    <Tooltip title="Retest">
                        <IconButton
                          onClick={() => retest(Number(params.row.id))}
                        >
                            <RefreshIcon size={IconSize.Large} />
                        </IconButton>
                    </Tooltip>
                    <ViewRedirectButton
                      path={`/submissions/${Number(params.row.id)}/details`}
                      location={VIEW}
                    />
                    <DeleteButton
                      id={Number(params.row.id)}
                      name="Submission"
                      text={`Are you sure that you want to delete submission #${params.row.id}?`}
                      mutation={useDeleteSubmissionMutation}
                    />
                </div>
            ),
        },
        {
            field: 'download',
            headerName: 'Download',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                    {
                        params.row.isBinaryFile
                            ? (
                                <Tooltip title="Download">
                                    <IconButton
                                      onClick={() => startDownload(Number(params.row.id))}
                                    >
                                        <DownloadIcon size={IconSize.Large} />
                                    </IconButton>
                                </Tooltip>
                            )
                            : null
                    }
                </div>
            ),
        },
    ];

    return (
        isLoading || isFetching
            ? <SpinningLoader />
            : (
                <AdministrationGridView
                  data={data}
                  error={error}
                  filterableGridColumnDef={dataColumns}
                  notFilterableGridColumnDef={nonFilterableColumns}
                  renderActionButtons={() => null}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  selectedFilters={selectedFilters || []}
                  selectedSorters={selectedSorters || []}
                  setSorterStateAction={setAdminSubmissionsSorters}
                  setFilterStateAction={setAdminSubmissionsFilters}
                  location="all-submissions"
                />
            )
    );
};

export default AdministrationSubmissionsPage;
