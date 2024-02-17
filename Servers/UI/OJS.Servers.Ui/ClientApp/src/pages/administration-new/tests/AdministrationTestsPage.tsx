/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Modal } from '@mui/material';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminTestsFilters, setAdminTestsSorters } from '../../../redux/features/admin/testsSlice';
import { useDeleteTestMutation, useGetAllAdminTestsQuery } from '../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import testsFilterableColums, { returnTestsNonFilterableColumns } from './testsGridColumns';

const AdministrationTestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditTestModal, setOpenEditTestModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ testId, setTestId ] = useState<number | null>(null);
    const selectedFilters = useSelector((state: IRootStore) => state.adminProblems['all-tests']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminProblems['all-tests']?.selectedSorters);
    const { data: testsData, isLoading: isLoadingTests, error } = useGetAllAdminTestsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filterParams ?? '' });
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortingParams ?? '' });
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenEditTestModal(true);
        setTestId(id);
    };

    const renderTestEditModal = (index: number) => (
        <Modal
          key={index}
          open={openEditTestModal}
          onClose={() => setOpenEditTestModal(false)}
        >
            <Box sx={modalStyles} />
        </Modal>
    );

    const renderGridSettings = () => (
        <div />

    );

    if (isLoadingTests) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    return (
        <AdministrationGridView
          filterableGridColumnDef={testsFilterableColums}
          notFilterableGridColumnDef={
                returnTestsNonFilterableColumns(
                    onEditClick,
                    useDeleteTestMutation,
                )
}
          data={testsData}
          renderActionButtons={renderGridSettings}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminTestsFilters}
          setSorterStateAction={setAdminTestsSorters}
          location="all-tests"
          modals={[
              { showModal: openEditTestModal, modal: (i) => renderTestEditModal(i) },
          ]}
        />
    );
};
export default AdministrationTestsPage;
