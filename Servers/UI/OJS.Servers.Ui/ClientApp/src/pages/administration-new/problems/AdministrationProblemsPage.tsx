/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { Box, IconButton, Modal, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import DeleteProblem from '../../../components/administration/Problems/delete/DeleteProblem';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminProblemsFilters, setAdminProblemsSorters } from '../../../redux/features/admin/problemsAdminSlice';
import { useGetAllAdminProblemsQuery } from '../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

const AdministrationProblemsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditProblemModal, setOpenEditProblemModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const selectedFilters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedSorters);
    const { data: problemsData, isLoading: isLoadingProblems, error } = useGetAllAdminProblemsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filterParams ?? '' });
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortingParams ?? '' });
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenEditProblemModal(true);
    };

    const filterableColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            flex: 0,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value.toString(),
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            type: 'string',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'contest',
            headerName: 'Contest',
            flex: 2,
            type: 'string',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'problemGroupId',
            headerName: 'Problem Group Id',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'problemGroup',
            headerName: 'Problem Group',
            flex: 1,
            type: 'string',
            filterable: false,
            align: 'center',
            sortable: false,
            headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value === '') {
                    return 'None';
                }
                return params.value.toString();
            },
        },
        {
            field: 'practiceTestsCount',
            headerName: 'Practice Tests',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'competeTestsCount',
            headerName: 'Compete Tests',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
            type: 'boolean',
            flex: 0.5,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
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
                    <IconButton onClick={() => onEditClick(Number(params.row.id))}>
                        <EditIcon color="warning" />
                    </IconButton>
                    <Link to={`/administration-new/problems/${Number(params.row.id)}`}>
                        <ShortcutIcon color="primary" />
                    </Link>
                    <Tooltip title="Delete">
                        <DeleteProblem
                          problemId={Number(params.row.id)}
                          problemName={params.row.name}
                          style={{ alignSelf: 'flex-end' }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];
    const renderProblemsEditModal = (index: number) => (
        <Modal
          key={index}
          open={openEditProblemModal}
          onClose={() => setOpenEditProblemModal(false)}
        >
            <Box sx={modalStyles}>
                <></>
            </Box>
        </Modal>
    );

    const renderGridSettings = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }} />

    );

    if (isLoadingProblems) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    return (
        <AdministrationGridView
          filterableGridColumnDef={filterableColumns}
          notFilterableGridColumnDef={nonFilterableColumns}
          data={problemsData}
          renderActionButtons={renderGridSettings}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminProblemsFilters}
          setSorterStateAction={setAdminProblemsSorters}
          location="all-problems"
          modals={[
              { showModal: openEditProblemModal, modal: (i) => renderProblemsEditModal(i) },
          ]}
        />
    );
};

export default AdministrationProblemsPage;
