/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconButton, Modal, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';

import { CREATE_NEW_EXAM_GROUP } from '../../../common/labels';
import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import ExamGroupEdit from '../../../components/administration/exam-groups/exam-group-edit/ExamGroupEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminExamGroupsFilters, setAdminExamGroupsSorters } from '../../../redux/features/admin/examGroupsAdminSlice';
import {
    useDeleteExamGroupMutation,
    useGetAllAdminExamGroupsQuery,
} from '../../../redux/services/admin/examGroupsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import examGroupsFilterableColumns, { returnExamGroupsNonFilterableColumns } from './examGroupsGridColumns';

const AdministrationExamGroupsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({ page: 1, itemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const [ openEditExamGroupModal, setOpenEditExamGroupModal ] = useState(false);
    const [ openShowCreateExamGroupModal, setOpenShowCreateExamGroupModal ] = useState<boolean>(false);
    const [ examGroupId, setExamGroupId ] = useState<number>();
    const selectedFilters = useSelector((state: IRootStore) => state.adminExamGroups['all-exam-groups']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminExamGroups['all-exam-groups']?.selectedSorters);
    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminExamGroupsQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditExamGroupModal(true);
        setExamGroupId(id);
    };

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevQueryParams) => ({ ...prevQueryParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevQueryParams) => ({ ...prevQueryParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const renderEditExamGroupModal = (index: number) => (
        <Modal
          key={index}
          open={openEditExamGroupModal}
          onClose={() => setOpenEditExamGroupModal(false)}
        >
            <Box sx={modalStyles}>
                <ExamGroupEdit examGroupId={Number(examGroupId)} />
            </Box>
        </Modal>
    );

    const renderCreateExamGroupModal = (index: number) => (
        <Modal key={index} open={openShowCreateExamGroupModal} onClose={() => setOpenShowCreateExamGroupModal(!openShowCreateExamGroupModal)}>
            <Box sx={modalStyles}>
                <ExamGroupEdit examGroupId={null} isEditMode={false} />
            </Box>
        </Modal>
    );

    const renderGridActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <Tooltip title={CREATE_NEW_EXAM_GROUP}>
                <IconButton
                  onClick={() => setOpenShowCreateExamGroupModal(!openShowCreateExamGroupModal)}
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
          filterableGridColumnDef={examGroupsFilterableColumns}
          notFilterableGridColumnDef={returnExamGroupsNonFilterableColumns(onEditClick, useDeleteExamGroupMutation)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminExamGroupsSorters}
          setFilterStateAction={setAdminExamGroupsFilters}
          location="all-exam-groups"
          modals={[
              { showModal: openShowCreateExamGroupModal, modal: (i) => renderCreateExamGroupModal(i) },
              { showModal: openEditExamGroupModal, modal: (i) => renderEditExamGroupModal(i) },
          ]}
        />
    );
};

export default AdministrationExamGroupsPage;
