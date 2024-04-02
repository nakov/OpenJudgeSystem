/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ExamGroupEdit from '../../../components/administration/exam-groups/exam-group-edit/ExamGroupEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import {
    useDeleteExamGroupMutation,
    useGetAllAdminExamGroupsQuery,
} from '../../../redux/services/admin/examGroupsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import examGroupsFilterableColumns, { returnExamGroupsNonFilterableColumns } from './examGroupsGridColumns';

const AdministrationExamGroupsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ??
        '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);
    const [ openEditExamGroupModal, setOpenEditExamGroupModal ] = useState(false);
    const [ openShowCreateExamGroupModal, setOpenShowCreateExamGroupModal ] = useState<boolean>(false);
    const [ examGroupId, setExamGroupId ] = useState<number>();
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
        <AdministrationModal
          key={index}
          index={index}
          open={openEditExamGroupModal}
          onClose={() => setOpenEditExamGroupModal(false)}
        >
            <ExamGroupEdit examGroupId={Number(examGroupId)} />
        </AdministrationModal>
    );

    const renderCreateExamGroupModal = (index: number) => (
        <AdministrationModal
          index={index}
          key={index}
          open={openShowCreateExamGroupModal}
          onClose={() => setOpenShowCreateExamGroupModal(!openShowCreateExamGroupModal)}
        >
            <ExamGroupEdit examGroupId={null} isEditMode={false} />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <CreateButton
          showModal={openShowCreateExamGroupModal}
          showModalFunc={setOpenShowCreateExamGroupModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
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
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          modals={[
              { showModal: openShowCreateExamGroupModal, modal: (i) => renderCreateExamGroupModal(i) },
              { showModal: openEditExamGroupModal, modal: (i) => renderEditExamGroupModal(i) },
          ]}
        />
    );
};

export default AdministrationExamGroupsPage;
