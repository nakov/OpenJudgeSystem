/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
// import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton, Modal, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../common/types';
import ContestEdit from '../../components/administration/Contests/ContestEdit/ContestEdit';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestCategoriesFilters, setAdminContestCategoriesSorters } from '../../redux/features/admin/contestCategoriesAdminSlice';
// import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../utils/object-utils';

import AdministrationGridView from './AdministrationGridView';
import { useGetAllAdminContestCategoriesQuery } from "../../redux/services/admin/contestCategoriesAdminService";
import ContestDeleteButton from "../../components/administration/Contests/delete/ContestDeleteButton";
import CategoryEdit from "../../components/administration/ContestCategories/CategoryEdit/CategoryEdit";

const AdministrationContestCategoriesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({ page: 1, ItemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const [ openEditContestCategoryModal, setOpenEditContestCategoryModal ] = useState(false);
    const [ openShowCreateContestCategoryModal, setOpenShowCreateContestCategoryModal ] = useState<boolean>(false);
    const [ contestCategoryId, setContestCategoryId ] = useState<number>();
    const selectedFilters = useSelector((state: IRootStore) => state.adminContestsCategories['all-contests-categories']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminContestsCategories['all-contests-categories']?.selectedSorters);

    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestCategoriesQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditContestCategoryModal(true);
        setContestCategoryId(id);
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
            width: 10,
            type: 'number',
            filterable: false,
            sortable: false,
            valueFormatter: (params) => params.value.toString(),
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
            field: 'orderBy',
            headerName: 'Order By',
            flex: 0.5,
            align: 'left',
            type: 'number',
            filterable: false,
            sortable: false,
        },
        {
            field: 'parent',
            headerName: 'Parent',
            width: 150,
            flex: 2,
            type: 'string',
            filterable: false,
            sortable: false,
        },
        {
            field: 'createdOn',
            headerName: 'Created On',
            width: 105,
            flex: 1,
            align: 'left',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'deletedOn',
            headerName: 'Deleted On',
            width: 105,
            flex: 1,
            align: 'left',
            type: 'date',
            filterable: false,
            sortable: false,
        },
        {
            field: 'modifiedOn',
            headerName: 'Modified On',
            width: 105,
            flex: 1,
            align: 'left',
            type: 'date',
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
                    <ContestDeleteButton contestId={Number(params.row.id)} contestName={params.row.name} />
                </div>
            ),
        },
    ];

    const renderEditContestCategoryModal = (index: number) => (
        <Modal
            key={index}
            open={openEditContestCategoryModal}
            onClose={() => setOpenEditContestCategoryModal(false)}
        >
            <Box sx={modalStyles}>
                <CategoryEdit contestCategoryId={Number(contestCategoryId)} isEditMode={true} />
            </Box>
        </Modal>
    );

    const renderCreateContestCategoryModal = (index: number) => (
        <Modal key={index} open={openShowCreateContestCategoryModal} onClose={() => setOpenShowCreateContestCategoryModal(!openShowCreateContestCategoryModal)}>
            <Box sx={modalStyles}>
                <CategoryEdit contestCategoryId={null} isEditMode={false} />
            </Box>
        </Modal>
    );

    const renderGridActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <Tooltip title="Create new contest category">
                <IconButton
                    onClick={() => setOpenShowCreateContestCategoryModal(!openShowCreateContestCategoryModal)}
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
            setSorterStateAction={setAdminContestCategoriesSorters}
            setFilterStateAction={setAdminContestCategoriesFilters}
            location="all-contests-categories"
            modals={[
                { showModal: openShowCreateContestCategoryModal, modal: (i) => renderCreateContestCategoryModal(i) },
                { showModal: openEditContestCategoryModal, modal: (i) => renderEditContestCategoryModal(i) },
            ]}
        />
    );
};

export default AdministrationContestCategoriesPage;