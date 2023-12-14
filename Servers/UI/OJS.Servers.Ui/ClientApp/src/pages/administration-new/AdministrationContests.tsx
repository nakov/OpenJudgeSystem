import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ContestEdit } from '../../components/administration/Contests/ContestEdit/ContestEdit';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { flexCenterObjectStyles } from '../../utils/object-utils';

const modalStyles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    fontFamily: 'Roboto, Helvetica , Arial',
};

const AdministrationContestsPage = () => {
    const [ openModal, setOpenModal ] = useState(false);
    const [ contestId, setContestId ] = useState<any>();
    const [ queryParams, setQueryParams ] = useState({ page: 1, ItemsPerPage: 15 });
    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery(queryParams);

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
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 250,
        },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            width: 60,
        },
        {
            field: 'contestPassword',
            headerName: 'Contest Password',
            width: 150,
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 105,
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 105,
        },
        {
            field: 'limitBetweenSubmissions',
            headerName: 'Limit Between Submissions',
        },
        {
            field: 'allowParallelSubmissionsInTasks',
            headerName: 'allowParallelSubmissionsInTasks',
        },
        {
            field: 'autoChangeTestsFeedbackVisibility',
            headerName: 'autoChangeTestsFeedbackVisibility',
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
        },
        {
            field: 'isVisible',
            headerName: 'Is Visible',
        },
        {
            field: 'showModal',
            headerName: 'Quick Details',
            width: 100,
            align: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <EditIcon onClick={() => onEditClick(params.row.id)} />
            ),
        },
        {
            field: 'showDetails',
            headerName: 'Details',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <Link to={`/administration/contests/${params.row.id}`}>
                    <ShortcutIcon />
                </Link>
            ),
        },
    ];

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <div style={{ height: '800px' }}>
            { error
                ? <div>Error loading data</div>
                : (
                    <>
                        { openModal && renderModal() }
                        <DataGrid
                          columns={dataColumns}
                          rows={data?.items ?? []}
                          rowCount={data?.totalCount ?? 0}
                          paginationMode="server"
                          onPageChange={(e) => {
                              setQueryParams({ ...queryParams, page: e + 1 });
                          }}
                        />
                    </>
                )}
        </div>
    );
};

export default AdministrationContestsPage;
