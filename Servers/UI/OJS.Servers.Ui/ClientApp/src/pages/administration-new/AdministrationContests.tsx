/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton, Modal, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../common/types';
import ContestEdit from '../../components/administration/Contests/ContestEdit/ContestEdit';
import ContestDeleteButton from '../../components/administration/Contests/delete/ContestDeleteButton';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../redux/features/admin/contestsAdminSlice';
import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../utils/object-utils';

import AdministrationGridView from './AdministrationGridView';

const AdministrationContestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditContestModal, setOpenEditContestModal ] = useState(false);
    const [ openShowCreateContestModal, setOpenShowCreateContestModal ] = useState<boolean>(false);
    const [ contestId, setContestId ] = useState<number>();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({ page: 1, ItemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const selectedFilters = useSelector((state: IRootStore) => state.adminContests['all-contests']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminContests['all-contests']?.selectedSorters);
    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditContestModal(true);
        setContestId(id);
    };

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filterParams ?? '' });
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortingParams ?? '' });
    }, [ sortingParams ]);

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            valueFormatter: (params) => params.value.toString(),
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
            type: 'string',
            filterable: false,
            sortable: false,
            flex: 2,
        },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            flex: 0.5,
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
            align: 'center',
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
                    <Link to={`/administration-new/contests/${Number(params.row.id)}`}>
                        <ShortcutIcon color="primary" />
                    </Link>
                    <ContestDeleteButton contestId={Number(params.row.id)} contestName={params.row.name} />
                </div>
            ),
        },
    ];

    const renderEditContestModal = (index: number) => (
        <Modal
          key={index}
          open={openEditContestModal}
          onClose={() => setOpenEditContestModal(false)}
        >
            <Box sx={modalStyles}>
                <ContestEdit contestId={Number(contestId)} />
            </Box>
        </Modal>
    );

    const renderCreateContestModal = (index: number) => (
        <Modal key={index} open={openShowCreateContestModal} onClose={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}>
            <Box sx={modalStyles}>
                <ContestEdit contestId={null} isEditMode={false} />
            </Box>
        </Modal>
    );

    const renderGridActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <Tooltip title="Create new contest">
                <IconButton
                  onClick={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}
                >
                    <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
        </div>
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={dataColumns}
          notFilterableGridColumnDef={nonFilterableColumns}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminContestsSorters}
          setFilterStateAction={setAdminContestsFilters}
          location="all-contests"
          modals={[
              { showModal: openShowCreateContestModal, modal: (i) => renderCreateContestModal(i) },
              { showModal: openEditContestModal, modal: (i) => renderEditContestModal(i) },
          ]}
        />
    );
};

export default AdministrationContestsPage;
