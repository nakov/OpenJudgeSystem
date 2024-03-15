/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddBoxIcon from '@mui/icons-material/AddBox';
import QueueIcon from '@mui/icons-material/Queue';
import { IconButton, Modal, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import {
    mapFilterParamsToQueryString,
} from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import {
    mapSorterParamsToQueryString,
} from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import { setAdminUsersFilters, setAdminUsersSorters } from '../../../../redux/features/admin/usersAdminSlice';
import { useDeleteUserFromExamGroupMutation } from '../../../../redux/services/admin/examGroupsAdminService';
import { useGetByExamGroupIdQuery } from '../../../../redux/services/admin/usersAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../../utils/object-utils';
import AddBulkUsersInGroupModal from '../add-bulk-users-in-group-modal/AddBulkUserInGroupModal';
import AddUserInExamGroupModal from '../add-user-in-group-modal/AddUserInGroupModal';
import DeleteUserFromGroupButton from '../delete-user-from-group-button/DeleteUserFromGroupButton';

import styles from './UsersInExamGroupView.module.scss';

interface IUsersInExamGroupViewProps {
    examGroupId: number;
}

const UsersInExamGroupView = (props: IUsersInExamGroupViewProps) => {
    const { examGroupId } = props;
    const filtersAndSortersLocation = `examGroup-details-users-${examGroupId}`;

    const selectedFilters =
        useSelector((state: IRootStore) => state.adminUsers[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
        useSelector((state: IRootStore) => state.adminUsers[filtersAndSortersLocation]?.selectedSorters) ?? [ ];
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const { data, error } = useGetByExamGroupIdQuery({ examGroupId: Number(examGroupId), ...queryParams });
    const [ openShowAddUserModal, setOpenShowAddUserModal ] = useState<boolean>(false);
    const [ openShowAddBulkUsersModal, setOpenShowAddBulkUsersModal ] = useState<boolean>(false);
    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);
    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filtersQueryParams });
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortersQueryParams });
    }, [ sortersQueryParams ]);

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            filterable: false,
            sortable: false,
            flex: 1,
            valueFormatter: (params) => params.value.toString(),
        },
        {
            field: 'userName',
            headerName: 'Username',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            filterable: false,
            flex: 2,
            sortable: false,
        },
    ];

    const notFilterableGridColumns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <DeleteUserFromGroupButton
                      id={String(params.row.id)}
                      examGroupId={Number(examGroupId)}
                      name={params.row.userName}
                      text="Are you sure that you want to delete the user?"
                      mutation={useDeleteUserFromExamGroupMutation}
                    />
                </div>
            ),
        },
    ];

    const renderAddUserModal = (index: number) => (
        <Modal key={index} open={openShowAddUserModal} onClose={() => setOpenShowAddUserModal(!openShowAddUserModal)}>
            <Box sx={modalStyles}>
                <AddUserInExamGroupModal examGroupId={examGroupId} />
            </Box>
        </Modal>
    );

    const renderAddBulkUsersModal = (index: number) => (
        <Modal key={index} open={openShowAddBulkUsersModal} onClose={() => setOpenShowAddBulkUsersModal(!openShowAddBulkUsersModal)}>
            <Box sx={modalStyles}>
                <AddBulkUsersInGroupModal examGroupId={examGroupId} />
            </Box>
        </Modal>
    );
    const renderActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <Tooltip title="Add user">
                <IconButton
                  onClick={() => setOpenShowAddUserModal(!openShowAddUserModal)}
                >
                    <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Add multiple users">
                <IconButton
                  onClick={() => setOpenShowAddBulkUsersModal(!openShowAddBulkUsersModal)}
                >
                    <QueueIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
        </div>
    );

    return (
        <>
            <Typography className={styles.centralize} variant="h4">
                Users
            </Typography>
            <div style={{ marginTop: '2rem' }}>
                <AdministrationGridView
                  data={data}
                  error={error}
                  filterableGridColumnDef={dataColumns}
                  notFilterableGridColumnDef={notFilterableGridColumns}
                  location={filtersAndSortersLocation}
                  queryParams={queryParams}
                  renderActionButtons={renderActions}
                  selectedFilters={selectedFilters}
                  selectedSorters={selectedSorters}
                  setFilterStateAction={setAdminUsersFilters}
                  setSorterStateAction={setAdminUsersSorters}
                  modals={[
                      { showModal: openShowAddUserModal, modal: (i) => renderAddUserModal(i) },
                      { showModal: openShowAddBulkUsersModal, modal: (i) => renderAddBulkUsersModal(i) },
                  ]}
                  setQueryParams={setQueryParams}
                  withSearchParams={false}
                />
            </div>
        </>
    );
};

export default UsersInExamGroupView;
