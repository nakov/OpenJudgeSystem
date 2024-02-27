import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Modal } from '@mui/material';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import ProblemForm from '../../../components/administration/Problems/problemForm/ProblemForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminProblemsFilters, setAdminProblemsSorters } from '../../../redux/features/admin/problemsAdminSlice';
import { useDeleteProblemMutation, useGetAllAdminProblemsQuery } from '../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import filterableColumns, { returnProblemsNonFilterableColumns } from './problemGridColumns';

const AdministrationProblemsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditProblemModal, setOpenEditProblemModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ problemId, setProblemId ] = useState<number | null>(null);
    const selectedFilters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedSorters);
    const { data: problemsData, isLoading: isLoadingProblems, error } = useGetAllAdminProblemsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenEditProblemModal(true);
        setProblemId(id);
    };

    const renderProblemsEditModal = (index: number) => (
        <Modal
          key={index}
          open={openEditProblemModal}
          onClose={() => setOpenEditProblemModal(false)}
        >
            <Box sx={modalStyles}>
                <ProblemForm problemId={Number(problemId)} isEditMode contestId={null} />
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
          notFilterableGridColumnDef={
                returnProblemsNonFilterableColumns(
                    onEditClick,
                    useDeleteProblemMutation,
                )
}
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
          legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
        />
    );
};

export default AdministrationProblemsPage;
