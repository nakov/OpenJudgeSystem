/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton, Modal, Slide, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import ContestEdit from '../../components/administration/Contests/ContestEdit/ContestEdit';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ROWS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles } from '../../utils/object-utils';

import AdministrationFilters, {
    mapGridColumnsToAdministrationFilterProps,
} from './administration-filters/AdministrationFilters';
import AdministrationSorting, {
    mapGridColumnsToAdministrationSortingProps,
} from './administration-sorting/AdministrationSorting';

const modalStyles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: '0px 0px 19px -4px rgba(0,0,0,0.75)',
    p: 4,
    fontFamily: 'Roboto, Helvetica , Arial',
    overflow: 'auto',
};

const AdministrationContestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openModal, setOpenModal ] = useState(false);
    const [ contestId, setContestId ] = useState<number>();
    const [ queryParams, setQueryParams ] = useState({ page: 1, ItemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filterParams ?? '' });
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortingParams ?? '' });
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenModal(true);
        setContestId(id);
    };

    const renderModal = () => (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
        >
            <Box sx={modalStyles}>
                <ContestEdit contestId={Number(contestId)} />
            </Box>
        </Modal>
    );

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            width: 10,
            align: 'center',
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            align: 'center',
            flex: 2,
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 250,
            align: 'center',
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            width: 60,
            flex: 1,
            align: 'center',
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'contestPassword',
            headerName: 'Contest Password',
            width: 150,
            flex: 2,
            align: 'center',
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 105,
            flex: 1,
            align: 'center',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 105,
            flex: 1,
            align: 'center',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'limitBetweenSubmissions',
            headerName: 'Limit Between Submissions',
            align: 'center',
            flex: 0,
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'allowParallelSubmissionsInTasks',
            headerName: 'allowParallelSubmissionsInTasks',
            type: 'boolean',
            flex: 0,
            filterable: false,
            sortable: false,
        },
        {
            field: 'autoChangeTestsFeedbackVisibility',
            headerName: 'autoChangeTestsFeedbackVisibility',
            type: 'boolean',
            flex: 0,
            filterable: false,
            sortable: false,
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
            type: 'boolean',
            flex: 0,
            filterable: false,
            sortable: false,
        },
        {
            field: 'isVisible',
            headerName: 'Is Visible',
            type: 'boolean',
            flex: 0,
            filterable: false,
            sortable: false,
        },
    ];

    const nonFilterableColumns: GridColDef[] = [
        {
            field: 'showModal',
            headerName: 'Quick Details',
            width: 100,
            align: 'center',
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => onEditClick(params.row.id)}>
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'showDetails',
            headerName: 'Details',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Link to={`/administration-new/contests/${params.row.id}`}>
                    <ShortcutIcon />
                </Link>
            ),
        },
    ];

    const sortingColumns = mapGridColumnsToAdministrationSortingProps(dataColumns);

    const filtersColumns = mapGridColumnsToAdministrationFilterProps(dataColumns);

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div style={{ height: '800px' }}>
                { openModal && renderModal() }
                <Typography marginBottom="0.5rem" align="center" variant="h5">Contests</Typography>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '500px' }}>
                    <AdministrationFilters columns={filtersColumns} location="allContests" />
                    <AdministrationSorting columns={sortingColumns} />
                </div>
                { error
                    ? <div>Error loading data</div>
                    : (
                        <DataGrid
                          columns={[ ...dataColumns, ...nonFilterableColumns ]}
                          rows={data?.items ?? []}
                          rowCount={data?.totalCount ?? 0}
                          paginationMode="server"
                          onPageChange={(e) => {
                              setQueryParams({ ...queryParams, page: e + 1 });
                          }}
                          rowsPerPageOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                          onPageSizeChange={(itemsPerRow: number) => {
                              setQueryParams({ ...queryParams, ItemsPerPage: itemsPerRow });
                          }}
                          pageSize={queryParams.ItemsPerPage}
                        />
                    )}
            </div>
        </Slide>
    );
};

export default AdministrationContestsPage;
