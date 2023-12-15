import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton, Modal, Slide, Typography } from '@mui/material';
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
    height: '95%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: '0px 0px 19px -4px rgba(0,0,0,0.75)',
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
            align: 'center',
            type: 'number',
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            align: 'center',
            resizable: true,
            flex: 2,
            type: 'string',
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 250,
            align: 'center',
            type: 'string',
        },
        {
            field: 'categoryId',
            headerName: 'Category Id',
            width: 60,
            flex: 1,
            align: 'center',
            type: 'number',
        },
        {
            field: 'contestPassword',
            headerName: 'Contest Password',
            width: 150,
            flex: 2,
            align: 'center',
            type: 'string',
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 105,
            flex: 1,
            align: 'center',
            type: 'date',
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 105,
            flex: 1,
            align: 'center',
            type: 'date',
        },
        {
            field: 'limitBetweenSubmissions',
            headerName: 'Limit Between Submissions',
            align: 'center',
            flex: 0,
            type: 'number',
        },
        {
            field: 'allowParallelSubmissionsInTasks',
            headerName: 'allowParallelSubmissionsInTasks',
            type: 'boolean',
            resizable: true,
            flex: 0,
        },
        {
            field: 'autoChangeTestsFeedbackVisibility',
            headerName: 'autoChangeTestsFeedbackVisibility',
            type: 'boolean',
            flex: 0,
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
            type: 'boolean',
            flex: 0,
        },
        {
            field: 'isVisible',
            headerName: 'Is Visible',
            type: 'boolean',
            flex: 0,
        },
        {
            field: 'showModal',
            headerName: 'Quick Details',
            width: 100,
            align: 'center',
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
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <div style={{ height: '800px' }}>
                { error
                    ? <div>Error loading data</div>
                    : (
                        <>
                            { openModal && renderModal() }
                            <Typography marginBottom="0.5rem" align="center" variant="h5">Contests</Typography>
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
        </Slide>
    );
};

export default AdministrationContestsPage;
