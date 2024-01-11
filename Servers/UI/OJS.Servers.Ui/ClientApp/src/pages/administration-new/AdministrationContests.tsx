/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton, Modal, Slide, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import ContestEdit from '../../components/administration/Contests/ContestEdit/ContestEdit';
import ContestDeleteButton from '../../components/administration/delete/ContestDeleteButton';
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

import styles from './AdministrationStyles.module.scss';

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
    const [ openEditContestModal, setOpenEditContestModal ] = useState(false);
    const [ openShowCreateContestModal, setOpenShowCreateContestModal ] = useState<boolean>(false);
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
        setOpenEditContestModal(true);
        setContestId(id);
    };

    const getRowClassName = (isDeleted: boolean, isVisible: boolean) => {
        if (isDeleted) {
            return styles.redGridRow;
        } if (!isVisible) {
            return styles.grayGridRow;
        }
        return '';
    };

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            width: 10,
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            flex: 2,
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 250,
            type: 'string',
            filterable: false,
            sortable: false,
            flex: 2,
        },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            width: 60,
            align: 'left',
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'contestPassword',
            headerName: 'Contest Password',
            width: 100,
            flex: 2,
            align: 'left',
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 105,
            flex: 1,
            align: 'left',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 105,
            flex: 1,
            align: 'left',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'limitBetweenSubmissions',
            headerName: 'Limit Between Submissions',
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
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => onEditClick(params.row.id)}>
                        <EditIcon color="warning" />
                    </IconButton>
                    <Link to={`/administration-new/contests/${params.row.id}`}>
                        <ShortcutIcon color="primary" />
                    </Link>
                    <ContestDeleteButton contestId={Number(params.row.id)} contestName={params.row.name} />
                </div>
            ),
        },
    ];

    const sortingColumns = mapGridColumnsToAdministrationSortingProps(dataColumns);

    const filtersColumns = mapGridColumnsToAdministrationFilterProps(dataColumns);

    const renderEditContestModal = () => (
        <Modal
          open={openEditContestModal}
          onClose={() => setOpenEditContestModal(false)}
        >
            <Box sx={modalStyles}>
                <ContestEdit contestId={Number(contestId)} />
            </Box>
        </Modal>
    );

    const renderCreateContestModal = () => (
        <Modal open={openShowCreateContestModal} onClose={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}>
            <Box sx={modalStyles}>
                <ContestEdit contestId={null} isEditMode={false} />
            </Box>
        </Modal>
    );

    const renderGridSettings = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <div>
                <Tooltip title="Create new contest">
                    <IconButton
                      onClick={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}
                    >
                        <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Create new contest with details">
                    <IconButton
                      onClick={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}
                    >
                        <CreateNewFolderIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                    </IconButton>
                </Tooltip>
            </div>
            <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between', width: '450px' }}>
                <AdministrationFilters columns={filtersColumns} location="all-contests" />
                <AdministrationSorting columns={sortingColumns} location="all-contests" />
            </div>
            <Box className={styles.legendBox}>
                <Box className={styles.rowColorBox}>
                    <Box className={`${styles.colorBox} ${styles.deleted}`} />
                    <p className={styles.colorSeparator}>-</p>
                    <p>Contest is deleted.</p>
                </Box>
                <Box className={styles.rowColorBox}>
                    <Box className={`${styles.colorBox} ${styles.visible}`} />
                    <p className={styles.colorSeparator}>-</p>
                    <p>Contest is not visible.</p>
                </Box>
            </Box>
        </div>
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div style={{ height: '745px' }}>
                { openEditContestModal && renderEditContestModal() }
                { openShowCreateContestModal && renderCreateContestModal() }
                { renderGridSettings() }
                { error
                    ? <div className={styles.errorText}>Error loading data</div>
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
                          getRowClassName={(params) => getRowClassName(params.row.isDeleted, params.row.isVisible)}
                          initialState={{
                              columns: {
                                  columnVisibilityModel: {
                                      isDeleted: false,
                                      isVisible: false,
                                  },
                              },
                          }}
                        />
                    )}
            </div>
        </Slide>
    );
};

export default AdministrationContestsPage;
